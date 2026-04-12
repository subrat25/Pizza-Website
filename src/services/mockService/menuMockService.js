const getMenu = () => {
  return [
    { id: "margherita", name: "Margherita", price: 800, tags: ["cheese", "tomato"] },
    { id: "pepperoni", name: "Pepperoni", price: 950, tags: ["meat"] },
    { id: "veggie", name: "Veggie Supreme", price: 900, tags: ["veggie"] },
    { id: "bbq", name: "BBQ Chicken", price: 1000, tags: ["chicken", "barbecue"] },
  ];
};

module.exports = {
  getMenu,
};