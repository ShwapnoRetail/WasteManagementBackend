const SalesData = require("../../models/new_models/SalesDataModel");
const WastageData = require("../../models/new_models/WastageDataModel");
const PNPInvoiceModel = require("../../models/new_models/PNPInvoiceModel");
const WastageDailyModel = require("../../models/new_models/WastageDailyModel");

function addCumulativeValues(data) {
  let cumulativeSales = 0;
  let cumulativeWastage = 0;

  return data.map((item) => {
    cumulativeSales += item.dailySales;
    cumulativeWastage += item.dailyWastage;

    const cumulativeSWPercentage = (cumulativeWastage / cumulativeSales) * 100;

    return {
      ...item,
      cumulativeSales: cumulativeSales,
      cumulativeWastage: cumulativeWastage,
      cumulativeSWPercentage: cumulativeSWPercentage.toFixed(5) + "%",
    };
  });
}

function addCumulativeValuesByOutlet(data) {
  const cumulativeData = {};

  return data.map((item) => {
    const { outlet_code, dailySales, dailyWastage } = item;

    if (!cumulativeData[outlet_code]) {
      cumulativeData[outlet_code] = {
        cumulativeSales: 0,
        cumulativeWastage: 0,
      };
    }

    cumulativeData[outlet_code].cumulativeSales += dailySales;
    cumulativeData[outlet_code].cumulativeWastage += dailyWastage;

    const cumulativeSWPercentage =
      (cumulativeData[outlet_code].cumulativeWastage /
        cumulativeData[outlet_code].cumulativeSales) *
      100;

    return {
      ...item,
      cumulativeSales: cumulativeData[outlet_code].cumulativeSales,
      cumulativeWastage: cumulativeData[outlet_code].cumulativeWastage,
      cumulativeSWPercentage: cumulativeSWPercentage.toFixed(3) + "%",
    };
  });
}

function addCumulativeValuesByOutletAndCat(data) {
  const cumulativeData = {};

  return data.map(item => {
      const { outlet_code, cat, dailySales, dailyWastage } = item;
      const key = `${outlet_code}_${cat}`;

      if (!cumulativeData[key]) {
          cumulativeData[key] = {
              cumulativeSales: 0,
              cumulativeWastage: 0
          };
      }

      cumulativeData[key].cumulativeSales += dailySales;
      cumulativeData[key].cumulativeWastage += dailyWastage;

      const cumulativeSWPercentage = (cumulativeData[key].cumulativeWastage / cumulativeData[key].cumulativeSales) * 100;

      return {
          ...item,
          cumulativeSales: cumulativeData[key].cumulativeSales,
          cumulativeWastage: cumulativeData[key].cumulativeWastage,
          cumulativeSWPercentage: cumulativeSWPercentage.toFixed(5) + "%"
      };
  });
}
function addCumulativeValuesByOutletAndOutlet(data) {
  const cumulativeData = {};

  return data.map(item => {
      const { outlet_code, article, dailySales, dailyWastage } = item;
      const key = `${outlet_code}_${article}`;

      if (!cumulativeData[key]) {
          cumulativeData[key] = {
              cumulativeSales: 0,
              cumulativeWastage: 0
          };
      }

      cumulativeData[key].cumulativeSales += dailySales;
      cumulativeData[key].cumulativeWastage += dailyWastage;

      const cumulativeSWPercentage = (cumulativeData[key].cumulativeWastage / cumulativeData[key].cumulativeSales) * 100;

      return {
          ...item,
          cumulativeSales: cumulativeData[key].cumulativeSales,
          cumulativeWastage: cumulativeData[key].cumulativeWastage,
          cumulativeSWPercentage: cumulativeSWPercentage.toFixed(5) + "%"
      };
  });
}

const createSalesData = async (req, res) => {
  try {
    const salesDataArray = req.body; // Assume the JSON array is sent in the request body
    const savedSalesData = await SalesData.insertMany(salesDataArray);
    res.status(201).json(savedSalesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllSalesData = async (req, res) => {
  try {
    const salesData = await SalesData.find();
    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSalesDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const salesData = await SalesData.find({ date: new Date(date) });
    res.status(200).json(salesData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteAllSalesData = async (req, res) => {
  try {
    await SalesData.deleteMany({});
    res.status(200).json({ message: "All SalesData entries deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSalesAndWastageData = async (req, res) => {
  try {
    const { salesData, wastageData } = req.body;

    if (!salesData || !wastageData) {
      return res
        .status(400)
        .json({ message: "SalesData and WastageData are required" });
    }

    const savedSalesData = [];
    const savedWastageData = [];

    for (const salesEntry of salesData) {
      const existingSales = await SalesData.findOne({
        date: salesEntry.date,
        outlet_code: salesEntry.outlet_code,
      });

      if (existingSales) {
        // Optionally, you can update the existing entry here instead of skipping
        await SalesData.updateOne(
          { _id: existingSales._id },
          { $set: salesEntry }
        );
        // console.log(`Sales entry already exists for date ${salesEntry.date} and outlet ${salesEntry.outlet_code}. Skipping insertion.`);
      } else {
        const newSalesData = await SalesData.create(salesEntry);
        savedSalesData.push(newSalesData);
      }
    }

    for (const wastageEntry of wastageData) {
      const existingWastage = await WastageData.findOne({
        date: wastageEntry.date,
        outlet_code: wastageEntry.outlet_code,
      });

      if (existingWastage) {
        // Optionally, you can update the existing entry here instead of skipping
        await WastageData.updateOne(
          { _id: existingWastage._id },
          { $set: wastageEntry }
        );
        console.log(
          `Wastage entry already exists for date ${wastageEntry.date} and outlet ${wastageEntry.outlet_code}. Skipping insertion.`
        );
      } else {
        const newWastageData = await WastageData.create(wastageEntry);
        savedWastageData.push(newWastageData);
      }
    }

    res.status(201).json({
      salesData: savedSalesData,
      wastageData: savedWastageData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSalesAndWastageDataByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchConditions = {
    invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];

  // Add outlet_code match only if provided
  if (req.user.role === "member") {
    aggregationPipeline.push({
      $match: { "invoice_data.outlet_code": req.user.outlet_code },
    });
  }

  // dailySales: { $sum: "$value" },

  // Group data by outlet_code and date, summing sales_tp to calculate value
  aggregationPipeline.push({
    $group: {
      _id: {
        // outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  // Project the final output format
  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
      day: 1,
    },
  });
  aggregationPipeline.push({ $sort: { date: 1 } });

  const matchStage = {
    wastage_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline2 = [
    // Match documents with the given wastage_date (and outlet_code if provided)
    { $match: matchStage },
    // Unwind the wastage_data array to deconstruct it into individual documents
    { $unwind: "$wastage_data" },
  ];

  if (req.user.role === "member") {
    aggregationPipeline2.push({
      $match: { "wastage_data.outlet_code": req.user.outlet_code },
    });
  }

  aggregationPipeline2.push({
    $match: { "wastage_data.movement": { $in: ["551", "552"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        // outlet_code: "$wastage_data.outlet_code",
        // outlet_name: "$wastage_data.outlet_name",
        date: "$wastage_date",
      },
      dailyWastage: { $sum: "$wastage_data.amount" },
    },
  });

  aggregationPipeline2.push({
    $addFields: {
      dailyWastage: { $abs: "$dailyWastage" },
    },
  });

  aggregationPipeline2.push(
    // Project the final output format
    {
      $project: {
        _id: 0,
        // outlet_code: "$_id.outlet_code",
        // outlet_name: "$_id.outlet_name",
        dailyWastage: "$dailyWastage",
        _id: "$_id.date",
        date: "$_id.date",
      },
    }
  );

  aggregationPipeline2.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    // console.log(salesData);
    // console.log(wastageData);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
      };
    });

    // console.log({ combinedData });

    const result = addCumulativeValues(combinedData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getSalesAndShrinkageDataByDateRange = async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchConditions = {
    invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];

  // Add outlet_code match only if provided
  if (req.user.role === "member") {
    aggregationPipeline.push({
      $match: { "invoice_data.outlet_code": req.user.outlet_code },
    });
  }

  // dailySales: { $sum: "$value" },

  // Group data by outlet_code and date, summing sales_tp to calculate value
  aggregationPipeline.push({
    $group: {
      _id: {
        // outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  // Project the final output format
  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
      day: 1,
    },
  });
  aggregationPipeline.push({ $sort: { date: 1 } });

  const matchStage = {
    wastage_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline2 = [
    // Match documents with the given wastage_date (and outlet_code if provided)
    { $match: matchStage },
    // Unwind the wastage_data array to deconstruct it into individual documents
    { $unwind: "$wastage_data" },
  ];

  if (req.user.role === "member") {
    aggregationPipeline2.push({
      $match: { "wastage_data.outlet_code": req.user.outlet_code },
    });
  }

  aggregationPipeline2.push({
    $match: { "wastage_data.movement": { $in: ["Z11", "Z12"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        // outlet_code: "$wastage_data.outlet_code",
        // outlet_name: "$wastage_data.outlet_name",
        date: "$wastage_date",
      },
      dailyWastage: { $sum: "$wastage_data.amount" },
    },
  });

  aggregationPipeline2.push({
    $addFields: {
      dailyWastage: { $abs: "$dailyWastage" },
    },
  });

  aggregationPipeline2.push(
    // Project the final output format
    {
      $project: {
        _id: 0,
        // outlet_code: "$_id.outlet_code",
        // outlet_name: "$_id.outlet_name",
        dailyWastage: "$dailyWastage",
        _id: "$_id.date",
        date: "$_id.date",
      },
    }
  );

  aggregationPipeline2.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    // console.log(salesData);
    // console.log(wastageData);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
      };
    });

    // console.log({ combinedData });

    const result = addCumulativeValues(combinedData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getSalesAndWastageDataByDateRangeOutlets = async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchConditions = {
    invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];

  if (req.user.role === "member") {
    aggregationPipeline.push({
      $match: { "invoice_data.outlet_code": req.user.outlet_code },
    });
  }

  aggregationPipeline.push({
    $group: {
      _id: {
        outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
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
    $match: { "wastage_data.movement": { $in: ["551", "552"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        outlet_code: "$wastage_data.outlet_code",
        date: "$wastage_date",
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
    },
  });

  aggregationPipeline.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
      };
    });

    // console.log({ combinedData });

    const result = addCumulativeValuesByOutlet(combinedData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};
const getSalesAndShrinkageDataByDateRangeOutlets = async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchConditions = {
    invoice_date: { $gte: new Date(startDate), $lte: new Date(endDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];

  if (req.user.role === "member") {
    aggregationPipeline.push({
      $match: { "invoice_data.outlet_code": req.user.outlet_code },
    });
  }

  aggregationPipeline.push({
    $group: {
      _id: {
        outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
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
    $match: { "wastage_data.movement": { $in: ["Z11", "Z12"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        outlet_code: "$wastage_data.outlet_code",
        date: "$wastage_date",
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
    },
  });

  aggregationPipeline.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
      };
    });

    // console.log({ combinedData });

    const result = addCumulativeValuesByOutlet(combinedData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getSalesAndWastageDataByDateRangeCat = async (req, res) => {
  const { startDate, endDate } = req.query;

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
        outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
        cat: "$invoice_data.cat",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
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
    $match: { "wastage_data.movement": { $in: ["551", "552"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        outlet_code: "$wastage_data.outlet_code",
        date: "$wastage_date",
        cat: "$wastage_data.cat",
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
      cat: "$_id.cat",
    },
  });

  aggregationPipeline.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    console.log(salesData);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.cat === sales.cat &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      // console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
        cat: sales.cat
      };
    });

    // console.log({ combinedData });

    // const result = addCumulativeValuesByOutletAndCat(combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getSalesAndShrinkageDataByDateRangeCat = async (req, res) => {
  const { startDate, endDate } = req.query;

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
        outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
        cat: "$invoice_data.cat",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
      day: { $first: { $dayOfWeek: "$invoice_date" } },
    },
  });

  aggregationPipeline.push({
    $project: {
      _id: 0,
      outlet_code: "$_id.outlet_code",
      dailySales: 1,
      date: "$_id.date",
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
    $match: { "wastage_data.movement": { $in: ["551", "552"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        outlet_code: "$wastage_data.outlet_code",
        date: "$wastage_date",
        cat: "$invoice_data.cat",
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
      cat: "$_id.cat",
    },
  });

  aggregationPipeline.push({ $sort: { date: 1 } });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);
    console.log(salesData);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      // console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
        cat: sales.cat
      };
    });

    // console.log({ combinedData });

    const result = addCumulativeValuesByOutletAndCat(combinedData);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};


const getSalesAndWastageDataByDateRangeArticle = async (req, res) => {
  const { startDate, endDate } = req.query;

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
        outlet_code: "$invoice_data.outlet_code",
        date: "$invoice_date",
        cat: "$invoice_data.cat",
        article: "$invoice_data.article",
      },
      dailySales: { $sum: "$invoice_data.sales_tp" },
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
    $match: { "wastage_data.movement": { $in: ["551", "552"] } },
  });

  aggregationPipeline2.push({
    $group: {
      _id: {
        outlet_code: "$wastage_data.outlet_code",
        date: "$wastage_date",
        cat: "$invoice_data.cat",
        article: "$invoice_data.article",
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
    console.log(salesData);
    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    const combinedData = salesData.map((sales, index) => {
      let wastageP = wastageData.find(
        (item) =>
          item.outlet_code === sales.outlet_code &&
          item.date.toISOString().split("T")[0] ===
            sales.date.toISOString().split("T")[0]
      );
      // console.log({ wastageP });
      return {
        date: sales.date.toISOString().split("T")[0],
        day: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ][sales.day - 1],
        dailySales: sales.dailySales,
        outlet_code: sales.outlet_code,
        dailyWastage: wastageP?.dailyWastage || 0,
        dailySWPercentage:
          (((wastageP?.dailyWastage || 0) / sales.dailySales) * 100).toFixed(
            5
          ) + "%",
        cat: sales.cat,
        article: sales.article,
      };
    });

    // console.log({ combinedData });

    // const result = addCumulativeValuesByOutletAndOutlet(combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};


const getSalesAndWastageDataBySingleDate = async (req, res) => {
  const { startDate } = req.query;

  const matchConditions = {
    invoice_date: { $eq: new Date(startDate) },
  };
  const matchConditions2 = {
    wastage_date: { $eq: new Date(startDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];
  const aggregationPipeline2 = [
    { $match: matchConditions2 },
    { $unwind: "$wastage_data" },
  ];

  aggregationPipeline2.push({
    $match: { "wastage_data.movement": { $in: ["551", "552"] } },
  });

  // Add outlet_code match only if provided
  if (req.user.role === "member") {
    aggregationPipeline.push({
      $match: { "invoice_data.outlet_code": req.user.outlet_code },
    });
    aggregationPipeline2.push({
      $match: { "wastage_data.outlet_code": req.user.outlet_code },
    });
  }

  // Group data by outlet_code and date, summing sales_tp to calculate value
  aggregationPipeline.push({
    $group: {
      _id: "$invoice_data.outlet_code",
      dailySales: { $sum: "$invoice_data.sales_tp" },
    },
  });

  aggregationPipeline2.push({
    $group: {
      _id: "$wastage_data.outlet_code",
      dailyWastage: { $sum: "$wastage_data.amount" },
      outlet_name: {
        $first: "$wastage_data.outlet_name",
      },
    },
  });

  // Project the final output format
  aggregationPipeline.push({
    $project: {
      _id: 1,
      // outlet_code: "$_id.outlet_code",
      dailySales: 1,
    },
  });
  // Project the final output format
  aggregationPipeline2.push({
    $project: {
      _id: 1,
      outlet_name: 1,
      dailyWastage: 1,
    },
  });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);

    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    console.log(salesData);
    console.log(wastageData);

    const combinedData = salesData.map((sales, index) => ({
      outlet_code: sales._id,
      outlet_name: wastageData.find((item) => item._id === sales._id)
        ? wastageData.find((item) => item._id === sales._id).outlet_name
        : "N/A",
      dailySales: sales.dailySales,
      dailyWastage: wastageData.find((item) => item._id === sales._id)
        ? Math.abs(
            wastageData.find((item) => item._id === sales._id).dailyWastage
          )
        : 0,
      dailySWPercentage: (
        ((wastageData.find((item) => item._id === sales._id)
          ? Math.abs(
              wastageData.find((item) => item._id === sales._id).dailyWastage
            )
          : 0) /
          sales.dailySales) *
        100
      ).toFixed(4),
    }));

    console.log(combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

const getSalesAndShrinkageDataBySingleDate = async (req, res) => {
  const { startDate } = req.query;

  const matchConditions = {
    invoice_date: { $eq: new Date(startDate) },
  };
  const matchConditions2 = {
    wastage_date: { $eq: new Date(startDate) },
  };

  const aggregationPipeline = [
    { $match: matchConditions },
    { $unwind: "$invoice_data" },
  ];
  const aggregationPipeline2 = [
    { $match: matchConditions2 },
    { $unwind: "$wastage_data" },
  ];

  aggregationPipeline2.push({
    $match: { "wastage_data.movement": { $in: ["Z11", "Z12"] } },
  });

  // Add outlet_code match only if provided
  if (req.user.role === "member") {
    aggregationPipeline.push({
      $match: { "invoice_data.outlet_code": req.user.outlet_code },
    });
    aggregationPipeline2.push({
      $match: { "wastage_data.outlet_code": req.user.outlet_code },
    });
  }

  // Group data by outlet_code and date, summing sales_tp to calculate value
  aggregationPipeline.push({
    $group: {
      _id: "$invoice_data.outlet_code",
      dailySales: { $sum: "$invoice_data.sales_tp" },
    },
  });

  aggregationPipeline2.push({
    $group: {
      _id: "$wastage_data.outlet_code",
      dailyWastage: { $sum: "$wastage_data.amount" },
      outlet_name: {
        $first: "$wastage_data.outlet_name",
      },
    },
  });

  // Project the final output format
  aggregationPipeline.push({
    $project: {
      _id: 1,
      // outlet_code: "$_id.outlet_code",
      dailySales: 1,
    },
  });
  // Project the final output format
  aggregationPipeline2.push({
    $project: {
      _id: 1,
      outlet_name: 1,
      dailyWastage: 1,
    },
  });

  try {
    const salesData = await PNPInvoiceModel.aggregate(aggregationPipeline);

    const wastageData = await WastageDailyModel.aggregate(aggregationPipeline2);

    console.log(salesData);
    console.log(wastageData);

    const combinedData = salesData.map((sales, index) => ({
      outlet_code: sales._id,
      outlet_name: wastageData.find((item) => item._id === sales._id)
        ? wastageData.find((item) => item._id === sales._id).outlet_name
        : "N/A",
      dailySales: sales.dailySales,
      dailyWastage: wastageData.find((item) => item._id === sales._id)
        ? Math.abs(
            wastageData.find((item) => item._id === sales._id).dailyWastage
          )
        : 0,
      dailySWPercentage: (
        ((wastageData.find((item) => item._id === sales._id)
          ? Math.abs(
              wastageData.find((item) => item._id === sales._id).dailyWastage
            )
          : 0) /
          sales.dailySales) *
        100
      ).toFixed(4),
    }));

    console.log(combinedData);

    res.status(200).json(combinedData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
};

module.exports = {
  createSalesData,
  getAllSalesData,
  getSalesDataByDate,
  deleteAllSalesData,
  createSalesAndWastageData,
  getSalesAndWastageDataByDateRange,
  getSalesAndShrinkageDataByDateRange,
  getSalesAndWastageDataBySingleDate,
  getSalesAndShrinkageDataBySingleDate,

  getSalesAndWastageDataByDateRangeOutlets,
  getSalesAndShrinkageDataByDateRangeOutlets,

  getSalesAndWastageDataByDateRangeCat,
  getSalesAndShrinkageDataByDateRangeCat,

  getSalesAndWastageDataByDateRangeArticle
};
