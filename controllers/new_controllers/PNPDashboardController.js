// const SalesData = require("../../models/new_models/SalesDataModel");
// const WastageData = require("../../models/new_models/WastageDataModel");
const PNPInvoiceModel = require("../../models/new_models/PNPInvoiceModel");
const WastageDailyModel = require("../../models/new_models/WastageDailyModel");



const getDashboardSalesAndWastageDataByDateRangeArticle = async (req, res) => {
    const { startDate, endDate, movement } = req.query;
  
    const matchConditions = {
      invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    };
  
    const aggregationPipeline = [
      { $match: matchConditions },
      { $unwind: "$invoice_data" },
    ];
  
    if (req.user.role === "member") {
      aggregationPipeline.push({
        $match: {
          "invoice_data.outlet_code": req.user.outlet_code,
        },
      });
    }
  
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
  
    if (req.user.role === "member") {
      aggregationPipeline2.push({
        $match: { "wastage_data.outlet_code": req.user.outlet_code },
      });
    }
  
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
  
    //   const sites = mergeAndRemoveDuplicates(salesData, wastageData);

   

  
      const combinedData = salesData.map((sales, index) => {
        let wastageP = wastageData.find(
          (item) =>
            item.outlet_code === sales.outlet_code &&
            item.article === sales.article &&
            item.date.toISOString().split("T")[0] === sales.date.toISOString().split("T")[0]
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
            : (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100),
          cat: sales.cat,
          article: sales.article,
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
  
      res.status(200).json([...combinedData,...noneSoldWastage]);
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Failed to fetch data" });
    }
  };



  module.exports = {  
    getDashboardSalesAndWastageDataByDateRangeArticle,
  };
  

