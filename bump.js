
const dataset1 = [
       { year: 2019, Agriculture: 31.69, Construction: 1.37, Communication: 0.26, Distribution: 10.84, Financial_Investiments: 0.47, Financial_Organizations: 14.62, Manufacturing: 9.99, Mining: 7.99, Services: 8.00, Transport: 0.82, Individuals: 13.88, Conglomerates: 0.07 },
       { year: 2020, Agriculture: 26.94, Construction: 0.79, Communication: 0.38, Distribution: 14.19, Financial_Investiments: 0.04, Financial_Organizations: 13.35, Manufacturing: 11.60, Mining: 10.73, Services: 6.71, Transport: 2.20, Individuals: 13.01, Conglomerates: 0.07 },
       { year: 2021, Agriculture: 29.14, Construction: 0.96, Communication: 0.30, Distribution: 13.19, Financial_Investiments: 0.31, Financial_Organizations: 5.91, Manufacturing: 11.88, Mining: 5.68, Services: 7.79, Transport: 1.62, Individuals: 23.22, Conglomerates: 0.02 },
       { year: 2022, Agriculture: 24.47, Construction: 1.38, Communication: 0.61, Distribution: 13.50, Financial_Investiments: 0.16, Financial_Organizations: 5.41, Manufacturing: 12.38, Mining: 11.28, Services: 10.76, Transport: 1.42, Individuals: 18.60, Conglomerates: 0.03 }
   ];

   const dataset2 = [
       { year: 2020, Individuals: 42, Agriculture: 20, Manufacturing: 17, Distribution: 12, Services: 9, Mining: 1 },
       { year: 2021, Individuals: 46, Agriculture: 18, Manufacturing: 14, Distribution: 7, Services: 15, Mining: 0 },
       { year: 2022, Individuals: 65, Agriculture: 8, Manufacturing: 9, Distribution: 8, Services: 9, Mining: 1 },
       { year: 2023, Individuals: 22, Agriculture: 22, Manufacturing: 21, Distribution: 5, Services: 30, Mining: 0 },
       { year: 2024, Individuals: 13, Agriculture: 9, Manufacturing: 65, Distribution: 3, Services: 7, Mining: 3 }
   ];

   let currentData = dataset1; // Default data

   const margin = { top: 40, right: 40, bottom: 50, left: 125 },
       //width = 900 - margin.left - margin.right,
       width = window.innerWidth - margin.left - margin.right; // Dynamic width based on screen width
       height = 500 - margin.top - margin.bottom;

   const svg = d3.select("#bump-chart")
       .append("svg")
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left},${margin.top})`);


   function renderChart(data) {

       // Clear previous elements
       //svg.selectAll("*").remove();
        
       d3.select("#bump-chart").select("svg").remove();
       // Recalculate width
    const width = window.innerWidth - margin.left - margin.right;

    // Create SVG
    const svg = d3.select("#bump-chart")
                  .append("svg")
                  .attr("width", "100%")
                  .attr("height", height + margin.top + margin.bottom)
                  .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);
       
       

       // Calculate rank order for each year
       const rankData = data.map(yearData => {
           const sectors = Object.keys(yearData).filter(key => key !== "year");
           sectors.sort((a, b) => yearData[b] - yearData[a]); // Sort in descending order
           return { year: yearData.year, ranks: sectors };
       });
    
   //this is where the order of the year on x axis is done
   const x = d3.scalePoint()
       .domain(data.map(d => d.year))
       .range([0,width]);

   const y = d3.scaleLinear()
       .domain([1, rankData[0].ranks.length]) // Rank positions (1st to Nth)
       .range([0, height - 30]); // Flips the rank, placing the 1st rank at the bottom

       // Custom color mapping for each sector
   const color = {
       "Agriculture": "#42bddf",
       "Construction": "#261214",
       "Communication": "#1B76FF",
       "Distribution": "#4a4948",
       "Financial_Investiments": "#FFBE00",
       "Financial_Organizations": "#25064C",
       "Manufacturing": "#ca1056",
       "Mining": "#2a455b",
       "Services": "#2e6368",
       "Transport": "#c0b156",
       "Individuals": "#f4b49b",
       "Conglomerates": "#cfb4bd"
   };

   //const color = d3.scaleOrdinal(d3.schemeCategory10);
   const tooltip = d3.select("#tooltip");
       
   
       // List of sectors
       const sectors = Object.keys(data[0]).filter(d => d !== "year");

       
       /*const sectors = ["Agriculture","Construction","Communication","Distribution","Financial_Investiments","Financial_Organizations","Manufacturing","Mining","Services","Transport","Individuals","Conglomerates"];*/


       // Radius scale for the circles, based on the percentage value
       const radiusScale = d3.scaleSqrt()
           .domain([0, d3.max(data, d => d3.max(sectors, sector => d[sector]))])
           .range([3, 12]); // Minimum and maximum circle sizes

       /*
       // Radius scale for circles, based on maximum percentage across sectors in multi-select data
       const radiusScale = d3.scaleSqrt()
       .domain([
       0,
       d3.max(data, d => d3.max(sectors, sector => d[sector])) // Find max across all sectors for each data point
       ])
       .range([3, 12]); // Circle size range

       // X scale: updated for multi-select with years or categories on x-axis
       x.domain(data.map(d => d.year)); // Ensure 'year' or appropriate category exists in each data object

       // Y scale: assumes each sector has its own level on the y-axis for multi-select
       y.domain([1, sectors.length]) // Number of levels equals number of selected sectors
       .range([0, height]); // Adjust to chart height
       */

       



       sectors.forEach(sector => {
           const line = d3.line()
               .x(d => x(d.year))
               .y(d => y(rankData.find(r => r.year === d.year).ranks.indexOf(sector) + 1)); // Get the rank index for the sector

       // Append the line for each sector
       svg.append("path")
           .datum(data)
           .attr("class", "line")
           .attr("class", "line line-" + sector) // Add sector to class for selection
           .attr("d", line)
           .attr("stroke", color[sector])
           .attr("stroke-width", 7) // Adjust this value to increase or decrease line width
           .attr("fill", "none"); // Ensure fill is none for a clear line

       // Append circles for each rank point of the sector
       // Create a linear scale for radius mapping
       const radiusScale = d3.scaleLinear()
           .domain([0, 100])  // Input domain (percentage values)
           .range([13.5, 40]);  // Output range (radius values)



       // Circle creation with dynamic radius assignment
       svg.selectAll(".dot-" + sector)
           .data(data)
           .enter().append("circle")
           .attr("class", "dot")
           .attr("cx", d => x(d.year))
           .attr("cy", d => y(rankData.find(r => r.year === d.year).ranks.indexOf(sector) + 1))
           .attr("r", d => radiusScale(d[sector])) // Assign radius based on percentage value
           .attr("fill", color[sector])
           .attr("stroke", color[sector])
           .attr("stroke-width", 2) // Optional: Add stroke width for better visibility
           .on("mouseover", (event, d) => {
               const rank = rankData.find(r => r.year === d.year).ranks.indexOf(sector) + 1;
               // Change opacity of other lines
               svg.selectAll(".line")
               .style("opacity", 0.1); // Reduce opacity of all lines

               // Highlight the current line
               svg.select(`.line-${sector}`)
               .style("opacity", 1); // Keep the current line fully opaque

               tooltip.transition().duration(200).style("opacity", 1);
               tooltip.html(`
                   <strong>${sector}</strong><br>
                   Year: ${d.year}<br>
                   Rank: ${rank}<br>
                   Value: ${d[sector]}
               `)
               .style("left", (event.pageX + 10) + "px")
               .style("top", (event.pageY - 28) + "px")
               .style("background-color", color[sector]); // Match the line color
             


               tooltip.transition().duration(500).style("opacity", 0);
           })
           .on("mouseout", () => {
               tooltip.transition().duration(500).style("opacity", 0);
               // Reset opacity of all lines
               svg.selectAll(".line")
               .style("opacity", 1); // Reset opacity to full

           });

       // Append text labels inside circles
       svg.selectAll(".label-" + sector)
           .data(data)
           .enter().append("text")
           .attr("class", "label")
           .attr("x", d => x(d.year))
           .attr("y", d => y(rankData.find(r => r.year === d.year).ranks.indexOf(sector) + 1))
           .attr("dy", ".35em") // Vertically center the text
           .attr("text-anchor", "middle") // Center the text horizontally
           .attr("fill", "#fff") // Set the text color
           .style("font-size", "12px") // Set the font size (adjust as needed)
           .text(d => `${d[sector]}%`); // Display the value with "%" sign
       });

       // Add x-axis
       svg.append("g")
           .attr("transform", `translate(0,${height + 30})`) // Align x-axis with the adjusted y-scale
           .call(d3.axisBottom(x).tickFormat(d3.format("d")))
           .selectAll("text") // Target the text labels on the axis
           .style("font-size", "15px"); // Set font size

       // Add x-axis label (Year)
       svg.append("text")
           .attr("class", "x-axis-label")
           .attr("x", width / 2)
           .attr("y", height + margin.bottom - 25) // Positioning the label below the x-axis
           .style("text-anchor", "middle")
           .style("font-size", "14px")
           .text("Year");

       // Add y-axis (rank positions)
       svg.append("g")
           .attr("transform", `translate(-25, 0)`)  // Move
           .call(d3.axisLeft(y).ticks(rankData[0].ranks.length).tickFormat(d => d))
           .selectAll("text") // Target the text labels on the axis
           .style("font-size", "11px"); // Set font size

       // Add y-axis label (Rank)
       svg.append("text")
           .attr("class", "y-axis-label")
           .attr("x", -height / 2) // Positioning the label on the left, rotated
           .attr("y", -margin.left +85) // Adjust positioning from the y-axis
           .attr("transform", "rotate(-90)") // Rotate the text to be vertical
           .style("text-anchor", "middle")
           .style("font-size", "11px")
           .text("Rank");


       // Add sector rank labels next to the y-axis (based on the first year ranks)
       const initialYear = rankData[0]; // 2024, the first year in the data
       svg.selectAll(".rank-label")
           .data(initialYear.ranks)
           .enter().append("text")
           .attr("class", "rank-label")
           .attr("x", -70) // Slightly to the left of the y-axis
           .attr("y", (d, i) => y(i + 1)) // Align with rank positions (using y scale)
           .attr("dy", ".35em") // Vertically center the text
           .attr("text-anchor", "end") // Right-align the text to the x value
           .style("font-size", "11px") // Font size
           .style("fill", color) // Optionally match label color with the sector
           .each(function(d) {
               const textElement = d3.select(this);
               
               // Split the sector name at underscores
               const lines = d.split("_");

               // Clear the existing text
               textElement.text("");

               // Append each part of the split text as a new tspan to handle line breaks
               lines.forEach((line, i) => {
                   textElement.append("tspan")
                       .attr("x", -50) // Keep aligned with original x
                       .attr("dy", i === 0 ? 0 : "1.2em") // Add line breaks by adjusting dy
                       .text(line); // Set text for each line
               });
           });
   }//end of renderChart

       document.querySelectorAll("input[name='dataset']").forEach(radio => {
radio.addEventListener("change", (event) => {
   currentData = event.target.value === "dataset1" ? dataset1 : dataset2;
   renderChart(currentData);
});
});

renderChart(currentData);  // Initial render
window.addEventListener('resize', renderChart(currentData));



