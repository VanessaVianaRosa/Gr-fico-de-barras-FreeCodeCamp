d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json", function(data) {
  
  const tip = d3.select('#tooltip');
  const gdp = d3.select('#gdp');
  const date = d3.select('#date');
  const tooltip = d3.select('#tooltip');

  const allData = data.data;
  const dates = data.data.map( dat => new Date(dat[0]) );
  
  const getQuarter = (month) => {
    switch(month) {
      case 'March':
        return 'Q1'
      case 'June':
        return 'Q2'
      case 'September':
        return 'Q3'
      case 'December':
        return 'Q4'
      default:
        return 'error'
    }
  }
  
  const hovered = (item) => {
    const formatDate = d3.timeFormat("%B %Y");
    const shortDate = formatDate(new Date(item[0])).split(' ');
    const month = getQuarter(shortDate[0]);
    const displayDate = month + ' ' + shortDate[1];
    gdp.text(`$${item[1]} billion`);
    date.text(`${displayDate}`);
    tooltip.attr('class', 'show');
    tooltip.attr('data-date', item[0]);
  }
  
  const unhovered = () => {
    tooltip.attr('class', 'hide')
  }
  
  d3.select('#title')
    .append('h2')
    .text(`United States GDP, in Billions`)

  const w = 1200;
  const h = 600;
  const space = 2;
  const padding = 50;
  const paddingr = padding - space;
  
  const xScale = d3.scaleTime()
                   .domain( [ d3.min(dates), d3.max(dates) ] )
                   .range([padding, w - paddingr]);

  const yScale = d3.scaleLinear()
                     .domain([0, d3.max(allData, (d) => d[1])])
                     .range([h - padding, padding]);
  
  const svg = d3.select('#chart')
    .append('svg')
    .attr('width', w)
    .attr('height', h)

  svg.selectAll('rect')
    .data(allData)
    .enter()
    .append('rect')
    .attr("x", (d, i) => xScale(dates[i]))
    .attr("y", (d) => yScale(d[1]))
    .attr("width", 3)
    .attr("height", (d) => h-yScale(d[1])-padding)
    .attr("fill", (d, i) => `rgb(${255}, ${255-i*.9}, ${0+i/2})`)
    .attr('data-date', (d,i) => d[0])
    .attr('data-gdp', (d) => d[1])
    .attr('class', 'bar')
    .on('mouseover', (d, i) => hovered(d) )
    .on('mouseout', () => unhovered())
  
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .attr('id', 'x-axis')
    .call(xAxis);

  svg.append('g')
    .attr('transform', `translate(${padding},0)`)
