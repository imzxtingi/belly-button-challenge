// Define json file for retrieval
const sampleFile = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

// Create dropdown menu
function dropdownMenu() {
    let dropdown = d3.select("#selDataset");

    d3.json(sampleFile).then((data) => {
        let names = data.names;
    
        names.forEach((sample) => {
            dropdown
            .append("option")
            .text(sample)
            .attr("value", sample)
        });

        barChart(names[0]);
        bubbleChart(names[0]);
        demographicInfo(names[0]);
})};

dropdownMenu();

// Create bar chart function
// Create variables
function barChart(sample) {
    d3.json(sampleFile).then((data) => {
        let samples = data.samples;
        let result = samples.find(item => item.id === sample);
        let sampleValue = result.sample_values;
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;
        let slicedSample = sampleValue.slice(0,10);
        let slicedID = otu_ids.slice(0,10);
        let slicedLabels = otu_labels.slice(0,10);

// Create trace
        let trace1 = {
            x: slicedSample.reverse(),
            y: slicedID.map(id => `OTU ${id}`).reverse(),
            text: slicedLabels.reverse(),
            type: "bar",
            orientation: "h"
            
        };

// Create data array and title and plot to Plotly
        let bardata = [trace1];
        let layout = {
            title: "Top 10 OTU Found"
        };

        Plotly.newPlot("bar", bardata, layout);
})};

// Create bubble chart function
// Create variables
function bubbleChart(sample){
    d3.json(sampleFile).then((data) => {
        let samples = data.samples;
        let result = samples.find(item => item.id === sample);
        let sampleValue = result.sample_values;
        let otu_ids = result.otu_ids;
        let otu_labels = result.otu_labels;

// Create trace
        let trace2 = {
            x: otu_ids,
            y: sampleValue,
            mode: "markers",
            marker:{
                size: sampleValue,
                color: otu_ids
            }
        };
// Create data array and title and plot to Plotly
        let bubbledata = [trace2];
        let layout = {
            title: "OTU ID"
        };

        Plotly.newPlot("bubble", bubbledata, layout);
    })};

// Create demographic table
function demographicInfo(sample){
    d3.json(sampleFile).then((data) => {
        let metadata = data.metadata;
        let result = metadata.filter(item => item.id == sample);
        let firstresult = result[0];
        
// Select div id = "sample-metadata" to add the key:pair values and clear the existing content in the div
        let sampleMetaData = d3.select("#sample-metadata");
        sampleMetaData.html("");
        Object.entries(firstresult).forEach(([key, value]) => {
            sampleMetaData.append("p").html(`<strong>${key}: ${value}</strong>`)
        });
    })};

// When changing the dropdown menu
function optionChanged(nextsample){
    barChart(nextsample);
    bubbleChart(nextsample);
    demographicInfo(nextsample);
};
