const axios = require("axios");
const knex = require("../knex"); // For database interaction
const xlsx = require("xlsx");
const fs = require("fs");
const path = require("path");

const handlePing = async (req, res) => {
  const { id: taskId } = req.query;

  try {
    const response = await axios.get(
      `https://api.dataforseo.com/v3/serp/google/organic/task_get/regular/${taskId}`,
      {
        auth: {
          username: process.env.DATAFORSEO_EMAIL,
          password: process.env.DATAFORSEO_PASSWORD,
        },
      }
    );

    const taskData = response.data.tasks[0];
    const result = taskData.result[0];
    if (!result) {
      throw new Error("No result found for the task.");
    }

    const keyword = taskData.data.keyword;
    const checkUrl = result.check_url;
    const items = result.items || [];
    const urlCount = result.items_count;
    const date = result.datetime;

    const excelFilePath = await saveResultToDBAndCreateExcel({
      taskId,
      keyword,
      checkUrl,
      urlCount,
      items,
      date,
    });

  // Function that will decrease credits from user balance
 // decreaseCredits = async (urlCount) => {}

    res
      .status(200)
      .json({ message: "Task processed successfully", excelFilePath });
  } catch (error) {
    console.error(`Error processing task ${taskId}:`, error.message);
    res
      .status(500)
      .json({ message: "Failed to process task", error: error.message });
  }
};

const saveResultToDBAndCreateExcel = async ({
  taskId,
  checkUrl,
  urlCount,
  items,
  date,
  keyword,
}) => {
  const formattedData = {
    date: date,
    keyword: keyword,
    links: items.map((item) => ({
      url: item.url,
    })),
  };
  const excelRows = items.map((item) => ({
    Date: date,
    Keyword: keyword,
    URL: item.url,
  }));

  await knex("tasks")
    .where({ task_id: taskId })
    .update({
      status: "ready",
      check_url: checkUrl,
      url_qty: urlCount,
      result_data: JSON.stringify(formattedData),
      updated_at: new Date(),
    });
  const exportsDir = path.join(__dirname, "../exports");

  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  const filePath = path.join(exportsDir, `results_${taskId}.xlsx`);

  const worksheet = xlsx.utils.json_to_sheet(excelRows);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, "Results");

  xlsx.writeFile(workbook, filePath);

  await knex("tasks").where({ task_id: taskId }).update({
    excel_file_path: filePath,
  });

  return filePath;
};

module.exports = { handlePing };
