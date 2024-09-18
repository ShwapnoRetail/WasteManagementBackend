const PNPInvoiceModel = require("../models/new_models/PNPInvoiceModel");
const wastageProductModel = require("../models/WastageProductModel");
const ProductOfferModel = require("../models/ProductOfferModel");

const WastageDailyModel = require("../models/new_models/WastageDailyModel");

const getInvoiceAndOfferProducts = async (req, res) => {
  const { startDate, endDate, outlet_code } = req.query;

  console.log({startDate,endDate});

  
  console.log("hello");

  if (!startDate || !endDate) {
    return res
      .status(400)
      .json({ message: "Please provide both startDate and endDate." });
  }

  const matchConditions = {
    invoice_date: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
  };



  const start = new Date(startDate);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setUTCHours(23, 59, 59, 999);



  try {
    const invoices = await PNPInvoiceModel.aggregate([
      {
        $match: matchConditions,
      },
      {
        $project: {
          invoice_data: 1, 
          _id: 0, 
        },
      },
    ]);


    // console.log({invoices});

    // console.log(start.toISOString(), end.toISOString());

    const appSalesData = await ProductOfferModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: start,
            $lte: end,
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // console.log({appSalesData});

    let flatInvoiceData = [];

    invoices.map((item) => flatInvoiceData.push(item.invoice_data));

    const invoice_data = flatInvoiceData.flat();

    const mergedData = [];

    invoice_data.forEach((item) => {
      // Find if the same article, outlet_code, sales_tp, and invoice_date already exists in mergedData
      const existingItem = mergedData.find((mergedItem) => {
        return (
          mergedItem.article === item.article &&
          mergedItem.outlet_code === item.outlet_code &&
          mergedItem.sales_tp === item.sales_tp 
          // new Date(mergedItem.invoice_date).toDateString() === new Date(item.invoice_date).toDateString()
        );
      });

      if (existingItem) {
        // If it exists, merge the sales_qty
        existingItem.sales_qty += item.sales_qty;
      } else {
        // If it doesn't exist, add a new entry to mergedData
        mergedData.push({ ...item });
      }
    });

    res
      .status(200)
      .json({ invoice_data: mergedData, appSalesData: appSalesData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};




const getWastageProductsSummed = async (req, res) => {

  const { startDate, endDate } = req.query;

  const matchConditions = {
    wastage_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };
  const matchConditions2 = {
    invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const { isNational } = req.query;

  let groupingData = {}
  let groupingData2 = {}

  // console.log(typeof isNational);

  if(isNational === "true"){
    console.log("in if");
    groupingData = {
      article_name: "$wastage_data.article_name",
      // cat: "$cat",
      article: "$wastage_data.article"
    }
    groupingData2 = {
      // article_name: "$wastage_data.article_name",
      // cat: "$cat",
      article: "$invoice_data.article"
    }
  }else{
    console.log("in else");
    groupingData = {
      outlet_code : "$wastage_data.outlet_code",
      // description: "$description",
      // cat: "$cat",
      // article: "$article"
    }
    groupingData2 = {
      outlet_code : "$invoice_data.outlet_code",
      // description: "$description",
      // cat: "$cat",
      // article: "$article"
    }
  }

  // console.log(isNational, groupingData);

  try {
    const wastageProduct = await WastageDailyModel.aggregate([
      { $match: matchConditions },
      { $unwind: "$wastage_data" },
      {
        $group: {
          _id: groupingData,
          // total_sales_amount: { $sum: { $toDouble: "$sales_amount" } },
          total_wastage_amount: { $sum:"$wastage_data.quantity" }
        }
      },
      {
        $project: {
          _id: 0,
          article: "$_id.article",
          description: "$_id.article_name",
          // cat: "$_id.cat",
          outlet_code: "$_id.outlet_code",
          // total_sales_amount: 1,
          total_wastage_amount: 1,
          // total_wastage_percentage: {
          //   $cond: {
          //     if: { $eq: ["$total_sales_amount", 0] },
          //     then: 0,
          //     else: {
          //       $multiply: [
          //         { $divide: ["$total_wastage_amount", "$total_sales_amount"] },
          //         100
          //       ]
          //     }
          //   }
          // }
        }
      }


    ]);

    const salesProduct = await PNPInvoiceModel.aggregate([
      { $match: matchConditions2 },
      { $unwind: "$invoice_data" },
      {
        $group: {
          _id: groupingData2,
          // total_sales_amount: { $sum: { $toDouble: "$sales_amount" } },
          total_sales_amount: { $sum:"$invoice_data.sales_qty" }
        }
      },
      {
        $project: {
          _id: 0,
          article: "$_id.article",
          // description: "$_id.article_name",
          // cat: "$_id.cat",
          outlet_code: "$_id.outlet_code",
          // total_sales_amount: 1,
          total_sales_amount: 1,
          // total_wastage_percentage: {
          //   $cond: {
          //     if: { $eq: ["$total_sales_amount", 0] },
          //     then: 0,
          //     else: {
          //       $multiply: [
          //         { $divide: ["$total_wastage_amount", "$total_sales_amount"] },
          //         100
          //       ]
          //     }
          //   }
          // }
        }
      }


    ]);

    
    // console.log(salesProduct);
    wastageProduct.map(item => {
      let salesP
      if(salesProduct[0]?.outlet_code){
        salesP = salesProduct.find(item2 => item2.outlet_code === item.outlet_code)
      }else{
        salesP = salesProduct.find(item2 => item2.article === item.article)
      }
      item.total_wastage_amount = Math.abs(item.total_wastage_amount)
      item.total_sales_amount = Math.abs(salesP?.total_sales_amount) || 0
      item.total_wastage_percentage = salesP && salesP?.total_sales_amount !== 0 ? Math.abs(item.total_wastage_amount)/salesP.total_sales_amount : 0
    })

    // console.log(wastageProduct);
    res.status(200).json(wastageProduct);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }

};

module.exports = {
  getInvoiceAndOfferProducts,
  getWastageProductsSummed
};
