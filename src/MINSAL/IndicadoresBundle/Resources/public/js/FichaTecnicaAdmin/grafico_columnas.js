graficoColumnas = function(ubicacion, datos, colorChosen, categoryChoosen) {

    this.tipo = 'columnas';
	this.currentDatasetChart = datos;
    this.zona = ubicacion;
	this.color = colorChosen;
	this.category = categoryChoosen;
	
    
    // Dibuja el gráfico
	var contexto=this;
    this.dibujar = function() 
	{
		
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
			.domain(this.currentDatasetChart.map(function(d) 
			{
				return d.category;
			}))
			.rangeRoundBands([0, width], .1);
	
		var max_y=100;
		var meta=0;
		
		var long = $('#' + contexto.zona + ' .titulo_indicador').attr('data-unidad-medida');
		texto="";
		if(long=="%")
		texto="Porcentaje";
		//El nivel máximo de la escala puede ser el mayor valor de la serie
		// o el mayor valor del rango, el usuario elige
		// se utiliza datasetPrincipal_bk por si se han aplicado filtros
		// Así no usará el máximo valor del filtro
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
		
	
		$('#' + this.zona + ' .grafico').html('');
		
		var svg = d3.select("#" + contexto.zona + ' .grafico')
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("id", "ChartPlot")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");						
			
		svg.selectAll("rect")
			.data(this.currentDatasetChart)
			.enter()
			.append("rect")
			.attr("class", "bar")											
			.transition().duration(1000).delay(20)
			.attr("width", xScale.rangeBand())			
			.attr("height", function(d) 
			{
				return height - yScale(parseFloat(d.measure));
			})
			.attr("x", function(d, i) 
			{
				return xScale(d.category);
			})
			.attr("y", function(d) 
			{
				return yScale(parseFloat(d.measure));
			});
				
		svg.selectAll("rect").append("title")
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
			.attr('y', function(d){return (height-((height*d.measure)/100))+((xScale.rangeBand()/6)<1 ? 1: (xScale.rangeBand()/6))+2})
			.attr('text-anchor', 'middle')
			.attr('font-size', (xScale.rangeBand()/6)<1 ? 1: (xScale.rangeBand()/6))
			.attr('font-family', 'arial')
			.attr('fill', '#fff');
		
		if(meta>0)
		{
			svg.append("line")
				.attr("x1", 5)
				.attr("y1", height-((height*meta)/100))
				.attr("x2", width)
				.attr("y2", height-((height*meta)/100))
				.attr("stroke-width", 1)
				.style("stroke-dasharray",("5","5"))
				.attr("stroke", "steelblue");	
		}
				
		svg.selectAll("rect").on("click", function(d, i) {
			descenderNivelDimension(contexto.zona, d.category);
		});
		
		if (this.color == null)
			svg.selectAll("rect").attr("fill", function(d, i) {
				//evaluar que this.color le corresponde
				return colores_alertas(contexto.zona, d.measure, i)
			});
		else
			svg.selectAll("rect").attr("fill", this.color);
	};
    this.ordenar = function(modo_orden, ordenar_por) 
	{
        var margin = {top: 10, right: 5, bottom: 25, left: 40},
		width = parseInt(d3.select('#'+this.zona+' .panel-body').style('width'), 10)
		width  = width - margin.left - margin.right-50,
		barPadding = 1;
		var height=parseInt(d3.select('#'+this.zona+' .panel-body').style('height'), 10)-150;
		if(height<300||height>width)
		height=width*.65;
		
		var xScale = d3.scale.ordinal()
			.domain(this.currentDatasetChart.map(function(d) 
			{
				return d.category;
			}))
			.rangeRoundBands([0, width], .1);
		var xAxis = d3.svg.axis().scale(xScale).orient("bottom");		
        var svg = d3.select("#" + this.zona + ' .grafico');
        
        var datos_ordenados = ordenarArreglo(this.currentDatasetChart, ordenar_por, modo_orden);
        var x0 = xScale.domain(datos_ordenados.map(function(d) 
				{
					return d.category;
				})).copy();

        var transition = svg.transition().duration(750),
                delay = function(d, i) 
				{
					return i * 40;
				};
        
        transition.selectAll("#"+this.zona+" rect")
                .delay(delay)
                .attr("x", function(d) 
				{
					return x0(d.category);
				});
        transition.select('#'+this.zona+' .x.axis')
                .call(xAxis)
                .selectAll("g")
                .delay(delay);
        // Ordenar la tabla de datos
        $('#' + this.zona).attr('datasetPrincipal', JSON.stringify(this.currentDatasetChart));
    };	
}