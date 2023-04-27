const stateUrl =
  "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const covidUrl =
  "https://api.covidactnow.org/v2/states.json?apiKey=a2efd0a0c1724d06aa869d12a2524124";

let stateData;
let covidData;

let canvas = d3.select("#canvas");
let toolTip = d3.select("#toolTip");

let drawMap = () => {
  canvas
    .selectAll("path")
    .data(stateData)
    .enter()
    .append("path")
    .attr("d", d3.geoPath())
    .attr("class", "state")
    .attr("fill", (stateDataItem) => {
      let id = stateDataItem.id;
      let state = covidData.find((item) => {
        return item.fips === id;
      });
      let percentPositiveCases =
        (state.actuals.positiveTests / state.population) * 100;
      if (percentPositiveCases <= 20) {
        return "#ffb8b8";
      } else if (percentPositiveCases <= 25) {
        return "#ff7070";
      } else if (percentPositiveCases <= 30) {
        return "#ff4242";
      } else if (percentPositiveCases <= 35) {
        return "#ff0000";
      } else {
        return "#850000";
      }
    })
    .attr("data-fips", (stateDataItem) => {
      return stateDataItem.id;
    })
    .attr("data-covid", (stateDataItem) => {
      let id = stateDataItem.id;
      let state = covidData.find((item) => {
        return item.fips === id;
      });
      let percentPositiveCases =
        (state.actuals.positiveTests / state.population) * 100;
      return percentPositiveCases;
    })
    .on("mouseover", (stateDataItem) => {
      toolTip.transition().style("visibility", "visible");

      let id = stateDataItem.id;
      let state = covidData.find((item) => {
        return item.fips === id;
      });
      let percentPositiveCases =
        (state.actuals.positiveTests / state.population) * 100;

      toolTip.text(state.state + "-" + Math.round(percentPositiveCases) + "%");
      toolTip.attr("data-coivd", percentPositiveCases);
    })
    .on("mouseout", (stateDataItem) => {
      toolTip.transition().style("visibility", "hidden");
    });
};

d3.json(stateUrl).then((data, error) => {
  if (error) {
    console.log(error);
  } else {
    stateData = topojson.feature(data, data.objects.states).features;
    console.log(stateData);
    d3.json(covidUrl).then((data, error) => {
      if (error) {
        console.log(error);
      }
      covidData = data;
      console.log(covidData);
      drawMap();
    });
  }
});
