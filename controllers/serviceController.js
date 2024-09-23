const PNPInvoiceModel = require("../models/new_models/PNPInvoiceModel");
const wastageProductModel = require("../models/WastageProductModel");
const ProductOfferModel = require("../models/ProductOfferModel");
const AltProductSub = require("../models/AltProductSubmissionModel");

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


// API to fetch and group data by outlet_name using aggregation
const getDateWiseSubmissions = async (req, res) => {
  try {
    const { date } = req.query;
    console.log(date);
    // Validate date input
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    // Define the date range
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);

    // Aggregation for AltProductSub (cash entry type)
    const altProductSubAggregation = AltProductSub.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          }
        }
      },
      {
        $group: {
          _id: "$outlet_code", // Group by outlet_code
          totalSales: { $sum: { $multiply: ['$quantity', '$discounter_price'] } },
          outlet_name: { $first: '$outlet_name' }
        }
      },
      {
        $addFields: {
          type: "cash entry",
        }
      },
      {
        $project: {
          _id: 0, // Remove _id from the output
          outlet_code: "$_id", // Rename _id to outlet_code
          outlet_name: 1,
          totalSales: 1,
          type: 1
        }
      }
    ]);
    const altProductSubAggregationArticles = AltProductSub.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          }
        }
      },
      {
        $addFields: {
          type: "cash entry",
        }
      },
      {
        $project: {
          min_mrp: "$discounter_price", // Rename a field
          outlet_code: 1,
          outlet_name: 1,
          article: 1,
          article_name: 1,
          quantity: 1,
          // createdAt: 1,
          type: 1,
          _id: 0
        }
      }
    ]);

    // Aggregation for OfferProduct (regular type)
    const offerProductAggregation = ProductOfferModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startOfDay,
            $lte: endOfDay,
          }
        }
      },
      {
        $group: {
          _id: "$outlet_code", // Group by outlet_code
          totalSales: { $sum: { $multiply: ['$so_quantity', '$min_mrp'] } },
          outlet_name: { $first: '$outlet_name' }
        }
      },
      {
        $addFields: {
          type: "regular"
        }
      },
      {
        $project: {
          _id: 0, // Remove _id from the output
          outlet_code: "$_id", // Rename _id to outlet_code
          outlet_name: 1,
          totalSales: 1,
          type: 1
        }
      }
    ]);
    const offerProductAggregationArticles = ProductOfferModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startOfDay,
            $lte: endOfDay,
          }
        }
      },
      {
        $addFields: {
          type: "regular"
        }
      },
      {
        $project: {
          min_mrp: 1, // Rename a field
          quantity: "$so_quantity",
          outlet_code: 1,
          outlet_name: 1,
          article: 1,
          article_name: 1,
          // createdAt: 1,
          type: 1,
          _id: 0
        }
      }
    ]);

    // Execute both aggregations in parallel
    const [altProducts, offerProducts] = await Promise.all([
      altProductSubAggregation,
      offerProductAggregation
    ]);
    const [altProductsArticles, offerProductsArticles] = await Promise.all([
      altProductSubAggregationArticles,
      offerProductAggregationArticles
    ]);

    // Combine the results
    const combinedResults = [...altProducts, ...offerProducts];

    // Create a Set to track unique outlet codes
    const uniqueOutletCodes = new Set(combinedResults.map(item => item.outlet_code));

    // Calculate total sales for the day
    const totalSalesForDay = combinedResults.reduce((total, item) => total + item.totalSales, 0);

    // Send the response with data, total outlets, and total sales for the day
    res.json({
      status: true,
      totalOutlets: uniqueOutletCodes.size,  // Total unique outlets
      totalSales: totalSalesForDay,          // Total sales for the day
      data: combinedResults,
      articleData: [...altProductsArticles, ...offerProductsArticles]   // Combined sales data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getDateWiseSubmissionsOutlet = async (req, res) => {
  try {
    const { date, outlet_code } = req.query;
    // Validate date input
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }
    
    // Define the date range
    const startOfDay = new Date(`${date}T00:00:00Z`);
    const endOfDay = new Date(`${date}T23:59:59Z`);
    
    console.log(startOfDay,endOfDay,outlet_code.length);


    const altProductSubAggregationArticles = AltProductSub.aggregate([
      {
        $match: {
          updatedAt: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
         
        }
      },
      {
        $addFields: {
          type: "cash entry",
        }
      },
      {
        $project: {
          min_mrp: "$discounter_price", // Rename a field
          outlet_code: 1,
          outlet_name: 1,
          article: 1,
          article_name: 1,
          quantity: 1,
          // createdAt: 1,
          type: 1,
          _id: 0
        }
      }
    ]);


    const offerProductAggregationArticles = ProductOfferModel.aggregate([
      {
        $match: {
          created_at: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
         
        }
      },
      {
        $addFields: {
          type: "regular"
        }
      },
      {
        $project: {
          min_mrp: 1, // Rename a field
          quantity: "$so_quantity",
          outlet_code: 1,
          outlet_name: 1,
          article: 1,
          article_name: 1,
          // createdAt: 1,
          type: 1,
          _id: 0
        }
      }
    ]);

    const [altProductsArticles, offerProductsArticles] = await Promise.all([
      altProductSubAggregationArticles,
      offerProductAggregationArticles
    ]);

    const combinedData = [...altProductsArticles, ...offerProductsArticles]

    outletData = combinedData.filter(item => item.outlet_code.trim() === outlet_code.trim())



    res.json({
      status: true,
      data: outletData   // Combined sales data
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  getInvoiceAndOfferProducts,
  getWastageProductsSummed,
  getDateWiseSubmissions,
  getDateWiseSubmissionsOutlet
};
