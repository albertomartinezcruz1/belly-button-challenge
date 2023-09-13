provurl="https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
function colors(oi){
    //this function gaves different color values to the bubble chart
    let colores=[];
    let cu="";
    //depending on the number it will give a different color
    for (let i=0;i<oi.length;i++){
        
        if (oi[i] < 100) {
            cu= 'rgb(108, 112, 183)';
          }else if (oi[i] < 300) {
            cu= 'rgb(76, 132, 184)';
          }
          else if (oi[i] < 400) {
            cu= 'rgb(76, 192, 201)';
          } else if (oi[i] < 800) {
            cu= 'rgb(84, 210, 175)';
          }
          else if (oi[i] < 1000) {
            cu= 'rgb(135, 227, 106)';
          }
          else if (oi[i] < 1600) {
            cu= 'rgb(192, 233, 110)';
          } 
          else {
            cu= 'rgb(146, 108, 36)';
          }
        colores.push(cu);
    }
    //it will return the color values
    return colores;
}   ; 

function barchart(oi,sample_values,otu_labels){

  ////////////////adding "OTU" TO otu ids to display data///////////
  let otu_ids=[]
  for (let i=0;i<oi.length;i++){

      let line=("OTU "+ oi[i])
      otu_ids.push(line);
  }
  //Slicing data since its already sorted
  let oi_ten=otu_ids.slice(0,10)
  let sample_values_ten=sample_values.slice(0,10)
  let otu_labels_ten=otu_labels.slice(0,10)

  //settin the data to plot
  let trace1 = {
    x: sample_values_ten.reverse(),
    y: oi_ten.reverse(),
    text: otu_labels_ten,
    type: "bar",
    orientation: "h"
  };

  let traceData = [trace1];
  
  // Apply a title to the layout
  let layout = {
    height: 500,
    width: 800
  };
  Plotly.newPlot("bar", traceData, layout);

};
function bubblechart(oi,sample_values,otu_labels){
  var trace_bubble = {
    x: oi,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: colors(oi),
      opacity: oi/2,
      size: sample_values
    }
  };
 
  var data_bubble = [trace_bubble];
  
  var layout_bubble = {
    title: 'OTU ID',
    showlegend: false,
    height: 500,
    width: 1000
  };
  
  Plotly.newPlot('bubble', data_bubble, layout_bubble);
  
};
function optionChanged(value){
  let dropdownMenu = d3.select("#selDataset");
  let seleted_option=dropdownMenu.property("value");
  ////////////////////////////////////////////////////////////////////////////7
  /////////////////////////////////////retrieving data
  const data=d3.json(provurl).then(function retrieveinfo(info) {
    var complete=[]
    metad=[]
    keys=[]
    for (let i=0;i<info.samples.length;i++){
        complete.push(Object.values(info.samples[i]));
        metad.push(Object.values(info.metadata[i]));
        keyss.push(Object.keys(info.metadata[i]));
    }
    ////////////////////////////////////////////////////////////////////////////7
  /////////////////////////////////////

    /////geting location in the array to avoid huge coding in dropdown, golden key
    /////gives us the number in wich we will found the data, this will be helpful to get the data
    for (let i=0;i<complete.length;i++){
      let id = complete[i][0];
      ////////////search where is the given info
      if (id == seleted_option) {
        golden_key=i;
        
      }  else {
        golden_key=golden_key;
      }
      
    };
    //Get data samples
    let id = complete[golden_key][0]
    let oi=complete[golden_key][1]
    let sample_values=complete[golden_key][2]
    let otu_labels=complete[golden_key][3]
    //Changing plots
    barchart(oi,sample_values,otu_labels);
    bubblechart(oi,sample_values,otu_labels);
    info_chart(keyss,metad,golden_key);
});

};

function info_chart(keyss,metad,golden_key){
  //deleting all before adding dthe info
  d3.selectAll("h6").remove();
  //adding the keys and values 
  for (let i=0;i<keyss[1].length;i++){
    line="";
    line=keyss[1][i]+":"+metad[golden_key][i]
    d3.select("#sample-metadata").append("h6").text(line);
}
};

const data=d3.json(provurl).then(function top10OTUS(info) {
        var complete=[]
        keyss=[]
        metad=[]
        //since is the first element we use 0
        gk=0;
        //Saving all data into different variables for an easier access
        for (let i=0;i<info.samples.length;i++){
            //getting the samples
            complete.push(Object.values(info.samples[i]));
            //getting de metadata
            metad.push(Object.values(info.metadata[i]));
            //gettin keys
            keyss.push(Object.keys(info.metadata[i]));
        }
        ////Gettin info for 940 the first element to display info
        let id = complete[gk][0]
        let oi=complete[gk][1]
        let sample_values=complete[gk][2]
        let otu_labels=complete[gk][3]
        //calling the functions
        info_chart(keyss,metad,gk);
        barchart(oi,sample_values,otu_labels);
        bubblechart(oi,sample_values,otu_labels); 
        //showing id in the dropdown using a for
          for (let i=0;i<info.names.length;i++){
            d3.selectAll("#selDataset").append("option").text(info.names[i])
        }
        ////////////////////////managing dataset changes
        d3.selectAll("#selDataset").on("change", a=optionChanged());
        
    });
