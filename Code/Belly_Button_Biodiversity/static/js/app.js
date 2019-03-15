function buildMetadata(sample) {

  // metadata panel function
  d3.json(`/metadata/${sample}`).then((data) => {

    var PANEL = d3.select("#sample-metadata");

    PANEL.html("");

    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key}: ${value}`);
    });
  })
};

function buildCharts(sample) {

  // Fetches the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    const ids = data.otu_ids;
    const labels = data.otu_labels;
    const values = data.sample_values;

    // Bubble Chart using the sample data
    // Set data parameters
    var trace1 = {
      x: ids,
      y: values,
      text: labels,
      mode: 'markers',
      marker: {
        color: ids,
        size: values
      }
    };

    var trace1 = [trace1];
    // Set layout parameters
    var layout = {
      showlegend: false,
      height: 600,
      width: 1500
    };

    Plotly.newPlot('bubble', trace1, layout);


    // Build a Pie Chart
    // Sort the data array
    values.sort((a, b) => a - b);
    ids.sort((a, b) => a - b);

    // Set data parameters
    var trace2 = {
      values: values.slice(0,10),
      labels: ids.slice(0,10),
      type: 'pie', 
    };

    var trace2 = [trace2];

    // Set layout parameters
    var layout = {
      showlegend: true,
      legend: {
        x: 1,
        y: 1
      }
      };

    Plotly.newPlot("pie", trace2, layout);
  });
}


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
