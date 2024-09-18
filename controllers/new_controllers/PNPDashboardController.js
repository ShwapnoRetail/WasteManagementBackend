// const SalesData = require("../../models/new_models/SalesDataModel");
// const WastageData = require("../../models/new_models/WastageDataModel");
const PNPInvoiceModel = require("../../models/new_models/PNPInvoiceModel");
const WastageDailyModel = require("../../models/new_models/WastageDailyModel");
const AltProductModel = require("../../models/AltProductModel");

const getDashboardSalesAndWastageDataByDateRangeArticle = async (req, res) => {
  const { startDate, endDate, movement } = req.query;

  const matchConditions = {
    invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];

  // if (req.user.role === "member") {
  //   aggregationPipeline.push({
  //     $match: {
  //       "invoice_data.outlet_code": req.user.outlet_code,
  //     },
  //   });
  // }

  aggregationPipeline.push({
    $group: {
      _id: {
        date: "$invoice_date",
        outlet_code: "$invoice_data.outlet_code",
        cat: "$invoice_data.cat",
        article: "$invoice_data.article",
      },
      dailySales: { $sum: "$invoice_data.nsi" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
      article: "$_id.article",
      cat: "$_id.cat",
      day: 1,
    },
  });

  aggregationPipeline.push({ $sort: { date: 1 } });

  const matchStage = {
    wastage_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline2 = [
    { $match: matchStage },
    { $unwind: "$wastage_data" },
  ];

  // if (req.user.role === "member") {
  //   aggregationPipeline2.push({
  //     $match: { "wastage_data.outlet_code": req.user.outlet_code },
  //   });
  // }

  aggregationPipeline2.push({
    $match: { "wastage_data.movement": { $in: movement } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        date: "$wastage_date",
        outlet_code: "$wastage_data.outlet_code",
        cat: "$wastage_data.cat",
        article: "$wastage_data.article",
      },
      dailyWastage: { $sum: "$wastage_data.amount" },
    },
  });

  aggregationPipeline2.push({
    $addFields: {
      dailyWastage: { $abs: "$dailyWastage" },
    },
  });

  aggregationPipeline2.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailyWastage: "$dailyWastage",
      _id: "$_id.date",
      date: "$_id.date",
      article: "$_id.article",
      cat: "$_id.cat",
    },
  });

  aggregationPipeline.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    //const sites = mergeAndRemoveDuplicates(salesData, wastageData);

    console.log(salesData.length, wastageData.length);

    const allProducts = await AltProductModel.find();

    // console.log(allProducts);

    // console.log(allProducts);
    salesData.map((item) => {
      const productDetails = allProducts.find(
        (product) => product.article === item.article
      );
      // console.log(productDetails);
      item.article_name = productDetails ? productDetails.article_name : "N/A";
    });

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.article === sales.article &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      return {
        date: sales.date.toISOString().split("T")[0],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage: isNaN(
          (wastageP?.dailyWastage || 0) / sales.dailySales
        )
          ? 0
          : ((wastageP?.dailyWastage || 0) / sales.dailySales) * 100,
        cat: sales.cat,
        article: sales.article,
        article_name: sales.article_name,
      };
    });

    let noneSoldWastage = [];
    wastageData.map((wastage, index) => {
      let wastageP = salesData.find(
        (item) =>
          item.outlet_code === wastage.outlet_code &&
          item.article === wastage.article &&
          item.date.toISOString().split("T")[0] ===
            wastage.date.toISOString().split("T")[0]
      );

      if (!wastageP) {
        noneSoldWastage.push({
          date: wastage.date.toISOString().split("T")[0],
          dailySales: 0,
          outlet_code: wastage.outlet_code,
          dailyWastage: wastage?.dailyWastage,
          dailySWPercentage: 0,
          cat: wastage.cat,
          article: wastage.article,
        });
      }
    });

    //   console.log({ noneSoldWastage });

    // const result = addCumulativeValuesByOutletAndOutlet(combinedData);

    res.status(200).json([...combinedData, ...noneSoldWastage]);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};


const streamLargeDataset = async (req, res) => 
{
  // const { startDate, endDate, movement } = req.query;

  // console.log({ startDate, endDate, movement });

  // const matchConditions = {
  //   invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  // };

  const aggregationPipeline = [
    // { $match: matchConditions },
    { $unwind: "$invoice_data" },
    {
      $group: {
        _id: {
          date: "$invoice_date",
          outlet_code: "$invoice_data.outlet_code",
          cat: "$invoice_data.cat",
          article: "$invoice_data.article",
        },
        dailySales: { $sum: "$invoice_data.nsi" },
        day: { $first: { $dayOfWeek: "$invoice_date" } },
      },
    },
    {
      $project: {
        _id: 0,
        outlet_code: "$_id.outlet_code",
        dailySales: 1,
        date: "$_id.date",
        article: "$_id.article",
        cat: "$_id.cat",
        day: 1,
      },
    },
    { $sort: { date: 1 } },
  ];

  // const matchStage = {
  //   wastage_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  // };

  const aggregationPipeline2 = [
    // { $match: matchStage },
    { $unwind: "$wastage_data" },
    // { $match: { "wastage_data.movement": { $in: movement } } },
    {
      $group: {
        _id: {
          date: "$wastage_date",
          outlet_code: "$wastage_data.outlet_code",
          cat: "$wastage_data.cat",
          article: "$wastage_data.article",
        },
        dailyWastage: { $sum: "$wastage_data.amount" },
      },
    },
    {
      $addFields: {
        dailyWastage: { $abs: "$dailyWastage" },
      },
    },
    {
      $project: {
        _id: 0,
        outlet_code: "$_id.outlet_code",
        dailyWastage: "$dailyWastage",
        date: "$_id.date",
        article: "$_id.article",
        cat: "$_id.cat",
      },
    },
    { $sort: { date: 1 } },
  ];

  try {
    // Start the streaming response
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.write('[');

    // Fetch product details once
    const allProducts = await AltProductModel.find();

    // Stream sales data
    const salesCursor = PNPInvoiceModel.aggregate(aggregationPipeline).cursor({ batchSize: 1000 });
    let first = true;

    console.log(salesCursor);

    for await (const sales of salesCursor) {
      if (!first) res.write(',');

      const productDetails = allProducts.find(product => product.article === sales.article);
      sales.article_name = productDetails ? productDetails.article_name : "N/A";

      // Fetch corresponding wastage data for each sales entry
      const wastageCursor = WastageDailyModel.aggregate([
        { $match: { wastage_date: sales.date, "wastage_data.article": sales.article } },
        ...aggregationPipeline2.slice(1)
      ]).cursor()

      let wastageP = null;
      for await (const wastage of wastageCursor) {
        if (
          wastage.outlet_code === sales.outlet_code &&
          wastage.article === sales.article &&
          wastage.date.toISOString().split('T')[0] === sales.date.toISOString().split('T')[0]
        ) {
          wastageP = wastage;
          break;
        }
      }

      const combinedResult = {
        date: sales.date.toISOString().split('T')[0],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage: isNaN((wastageP?.dailyWastage || 0) / sales.dailySales)
          ? 0
          : ((wastageP?.dailyWastage || 0) / sales.dailySales) * 100,
        cat: sales.cat,
        article: sales.article,
        article_name: sales.article_name,
      };

      res.write(JSON.stringify(combinedResult));
      first = false;
    }

    // Stream wastage data that doesn't have corresponding sales
    const wastageCursor = WastageDailyModel.aggregate(aggregationPipeline2).cursor({ batchSize: 1000 });

    for await (const wastage of wastageCursor) {
      const correspondingSales = await PNPInvoiceModel.findOne({
        invoice_date: wastage.date,
        "invoice_data.article": wastage.article,
        "invoice_data.outlet_code": wastage.outlet_code,
      });

      if (!correspondingSales) {
        if (!first) res.write(',');
        const noneSoldWastage = {
          date: wastage.date.toISOString().split('T')[0],
          dailySales: 0,
          outlet_code: wastage.outlet_code,
          dailyWastage: wastage.dailyWastage,
          dailySWPercentage: 0,
          cat: wastage.cat,
          article: wastage.article,
          article_name: allProducts.find(product => product.article === wastage.article)?.article_name || "N/A",
        };
        res.write(JSON.stringify(noneSoldWastage));
        first = false;
      }
    }

    res.write(']');
    res.end();
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
};




module.exports = {
  getDashboardSalesAndWastageDataByDateRangeArticle,
  streamLargeDataset,
};
