// Use the D3 library to read in samples.json from the URL
// Initialize page with default plot
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function charts(selectedPatientID) {
    d3.json(url).then((data) => {
      var plottingData = data.samples;
      var subject = plottingData.filter(
        (sampleobject) => sampleobject.id == selectedPatientID
      )[0];
  
      console.log(subject);
      var ids = subject.otu_ids;
      var labels = subject.otu_labels;
      var values = subject.sample_values;
  
      // Create horizontal bar chart with top 10 OTUs per patient
      var trace1 = {
        x: values.slice(0, 10).reverse(),
        y: ids
          .slice(0, 10)
          .map((otuID) => `OTU ${otuID}`)
          .reverse(),
        text: labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      };
  
      var data = [trace1];
  
      var layout = {
        title: "<b> Top 10 OTUs </b>",
        xaxis: { autorange: true },
        yaxis: { autorange: true },
        margin: { t: 70, l: 100 },
        height: 500,
      };
  
      Plotly.newPlot("bar", data, layout);
  
      // Create bubble chart with frequency of all OTUs per patient
      var trace1 = {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          color: ids,
          size: values,
          colorscale: "Jet",
        },
      };
  
      var data = [trace1];
  
      var layout = {
        title: "<b> Frequency of OTUs </b>",
        margin: { t: 70, l: 100 },
        xaxis: { title: "OTU ID" },
        hovermode: "closest",
        width: window.width,
      };
  
      Plotly.newPlot("bubble", data, layout);
    });
  }
  
  // Create demographic info box
  function demo(selectedPatientID) {
    d3.json("samples.json").then((data) => {
      var MetaData = data.metadata;
      var subject = MetaData.filter(
        (sampleobject) => sampleobject.id == selectedPatientID
      )[0];
      var demInfo = d3.select("#sample-metadata");
      demInfo.html("");
      Object.entries(subject).forEach(([key, value]) => {
        demInfo.append("h5").text(`${key}: ${value}`);
      });
  
      // Create gauge for washing frequency 
      var guageData = [
        {
          domain: { x: [0, 5], y: [0, 1] },
          value: subject.wfreq,
          text: subject.wfreq,
          type: "indicator",
          mode: "gauge+number",
          delta: { reference: 10 },
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              { range: [0, 1], color: "rgb(248, 243, 236)" },
              { range: [1, 2], color: "rgb(239, 234, 220)" },
              { range: [2, 3], color: "rgb(230, 225, 205)" },
              { range: [3, 4], color: "rgb(218, 217, 190)" },
              { range: [4, 5], color: "rgb(204, 209, 176)" },
              { range: [5, 6], color: "rgb(189, 202, 164)" },
              { range: [6, 7], color: "rgb(172, 195, 153)" },
              { range: [7, 8], color: "rgb(153, 188, 144)" },
              { range: [8, 9], color: "rgb(132, 181, 137)" },
            ],
          },
        },
      ];
  
      let layout = {
        title: "<b>Belly Button Washing Frequency</b> <br>Scrubs Per Week</br>",
        width: 400,
        height: 400,
        margin: { t: 70, r: 25, l: 25, b: 25 },
      };
      Plotly.newPlot("gauge", guageData, layout);
    });
  }
  
  // Call data into console
  function init() {
    d3.json(url).then(function (data) {
      console.log(url, data);
      
      // Create DropDown
      var DropDown = d3.select(`#selDataset`);
  
      data.names.forEach((name) => {
        DropDown.append(`option`).text(name).property(`value`, name);
      });
      
      // Reset demographic info and visuals when page is refreshed
      const firstID = data.names[0];
      charts(firstID);
      demo(firstID);
    });
  }
  // Pull data for new patient into demo and visuals
  function optionChanged(newID) {
    charts(newID);
    demo(newID);
  }
  
  init();