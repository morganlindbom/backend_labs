function renderLandingPage(req, res) {
  // Entry page for the Lab3 web interface.
  return res.render("index");
}

function renderFridayPage(req, res) {
  const dateParam = req.query.date;
  const date = dateParam ? new Date(dateParam) : new Date();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const day = days[date.getDay()];
  const isFriday = date.getDay() === 5;

  return res.render("friday", {
    date: date.toDateString(),
    day,
    isFriday,
  });
}

export default {
  renderLandingPage,
  renderFridayPage,
};
