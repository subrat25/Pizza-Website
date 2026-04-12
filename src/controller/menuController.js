const menuMockService = require("../services/mockService/menuMockService");
const menuService = require("../services/service/menuService");

const menuMapperService = process.env.USE_MOCK_SERVICES_Menu === "true" ? menuMockService : menuService;

const getMenu = async (req, res) => {
  try {
    const menu = await menuMapperService.getMenu();
    res.json(menu);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  getMenu,
};