graficoLineas = function(ubicacion, datos, colorChosen, categoryChoosen) {

    this.tipo = 'lineas';
	this.currentDatasetChart = datos;
    this.zona = ubicacion;
	this.color = colorChosen;
	this.category = categoryChoosen;
	
	var contexto=this;
	this.dibujar = function() {
		var margin = {top: 10, right: 40, bottom: 75, left: 50},
		width = parseInt(d3.select('#'+this.zona+' .panel-body').style('width'), 10)
		width  = width - margin.left - margin.right-50,
		barPadding = 1;
		var height=parseInt(d3.select('#'+this.zona+' .panel-body').style('height'), 10)-150;
		if ($('#' + zona + '_icon_maximizar').hasClass('glyphicon glyphicon-zoom-out'))
			height=height-50;
		if(height<300||height>width)
		height=width*.65;				
	
		var xScale = d3.scale.ordinal()
            .domain(contexto.currentDatasetChart.map(function(d) 
			{
				return d.category;
			}))
            .rangeRoundBands([0, width], 1);
		
		var max_y=100;
		var meta=0;
		
		var long = $('#' + contexto.zona + ' .titulo_indicador').attr('data-unidad-medida');
		texto="";
		if(long=="%")
		texto="Porcentaje";
		
		var datasetPrincipal_bk = JSON.parse($('#' + this.zona).attr('datasetPrincipal_bk'));
		max_y = d3.max(datasetPrincipal_bk, function(d) 
		{
			return parseFloat(d.measure);
		});
		if ($('#' + this.zona + ' .max_y') != null && $('#' + this.zona + ' .max_y').val() == 'rango_alertas')
			max_y = $('#' + this.zona + ' .titulo_indicador').attr('data-max_rango');
	
		if (parseFloat($('#' + this.zona + 'meta').attr("data-id"))>0)
		{
			meta=$('#' + this.zona + 'meta').attr("data-id");
			max_y = $('#' + this.zona + ' .titulo_indicador').attr('data-max_rango');
		}
		
		var yScale = d3.scale.linear()
			.domain([0, max_y])
			.range([height, 0]);
	
		var yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(10);
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
			
		var line = d3.svg.line()			
			.x(function(d, i) 
			{
				return xScale(d.category);
			})
			.y(function(d) 
			{
				return yScale(parseFloat(d.measure));
			});

        $('#' + this.zona + ' .grafico').html('');
		
		var svg = d3.select("#" + contexto.zona + ' .grafico')
			.append("svg")
			//.datum(contexto.currentDatasetChart)
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("id", "ChartPlot")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
		svg.append("svg:path")
			.attr("d", line(contexto.currentDatasetChart))
			.style("stroke",function()
			{
				return "steelblue";
			})
			.style("fill","none")
			.style("stroke-width","1.5");
		
		var datacircleGroup=svg.append("svg:g");
		var circles=datacircleGroup.selectAll("data-point").data(contexto.currentDatasetChart)
								  
		circles.enter()
			   .append("svg:circle")
			   .attr("class","dot")
			   .attr("fill", "white") 
			   .style("stroke-width","1.5")
			   .attr("stroke", function(d, i) 
				{
					return colores_alertas(contexto.zona, d.measure, i)
				})
				.attr("cx", line.x())
				.attr("cy", line.y())
				.attr("r", 5)
				.on("mouseover",function(d)
				{
					d3.select(this)
					.attr("r",10)
					.attr("stroke","ligth-gray")
					.attr("fill", function(d, i) 
					{
						return colores_alertas(contexto.zona, d.measure, i)
					})
					.transition().duration(750);
				})
				.on("mouseout",function(d)
				{
					d3.select(this)
					.attr("r",5)
					.attr("fill", "white") 
				   .style("stroke-width","1.5")
				   .attr("stroke", function(d, i) 
					{
						return colores_alertas(contexto.zona, d.measure, i)
					})
					.transition().duration(750);
				});
				
        svg.selectAll(".dot")
			.append("title")
			.text(function(d) 
			{
				return d.category + ": " + d.measure;
			});
				
        svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);       
		
		svg.append("text")
			.attr("class","axis-label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "-4.2em")	  
			.text(long+" "+texto)
			.style("text-anchor", "end")
			.style("font-size", "0.7em");
			
		svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis)		  
			.selectAll("text")			
			.attr('x', 7).attr('y', 10)
			.attr('text-anchor', 'start')
			.attr('style', '')
			.style("font-size", "0.7em")			
			.attr("transform", "rotate(30)");                
				
		if(meta>0)
		{
			svg.append("line")
				.attr("x1", 5)
				.attr("y1", height-((height*meta)/100))
				.attr("x2", width)
				.attr("y2", height-((height*meta)/100))
				.attr("stroke-width", 1)
				.style("stroke-dasharray",("5","5"))
				.attr("stroke", "green");	
		}
		var plot = svg
		.append("g")
		
		plot.selectAll("text")
			.data(contexto.currentDatasetChart)
			.enter()
			.append("text")
			.text(function(d) 
			{
				return d.measure;
			})
			.attr('x', function(d,i){return (i)*(width/contexto.currentDatasetChart.length)+(width/contexto.currentDatasetChart.length)/2;})
			.attr('y', function(d){a= yScale(parseFloat(d.measure))+15; if(a<0) a=0; return a;})
			.attr('text-anchor', 'middle')
			.attr('font-size', 10)
			.attr('font-family', 'arial')
			.attr('fill', '#000');
		
		/*plot.append("path")
			.attr("class", "line")
			.attr("d", line)
			.attr("stroke", 'steelblue');*/
				
        svg.selectAll(".dot").on("click", function(d, i) {
            descenderNivelDimension(contexto.zona, d.category);
        });
    };
    this.ordenar = function(modo_orden, ordenar_por) {
        var svg = d3.select("#" + zona + ' .grafico ');
        
        var datos_ordenados = ordenarArreglo(contexto.currentDatasetChart, ordenar_por, modo_orden);
        var x0 = xScale.domain(datos_ordenados.map(function(d) 
				{
					return d.category;
				})).copy();        
        var transition = svg.transition().duration(750),
						delay = function(d, i) 
						{
							return i * 40;
						};

        transition.selectAll(".line").delay(delay).attr("d", line).attr("stroke", 'blue');
        transition.selectAll(".dot").delay(delay).attr("cx", function(d) {
            return x0(d.category);
        });
        transition.select(".x.axis").call(xAxis).selectAll("g").delay(delay);
        
        // Ordenar la tabla de datos
        $('#' + zona).attr('datasetPrincipal', JSON.stringify(contexto.currentDatasetChart));

    };
}