import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as d3 from 'd3';


export interface ChartData {
    date: any;
    open: number;
    high: number;
    low: number;
    close: number;
}

@Component({
    selector: 'app-chart',
    template: `<div class='d3-chart' #chart></div>`,
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {
    @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
    private svg: any;
    private element: any;

    // 챠트 관련 변수
    private margin = {top: 20, right: 20, bottom: 20, left: 20};
    private width = 600;
    private height = 400;
    private duration = 500;
    private color = d3.schemeCategory10;

    // 데이타용 변수
    private lineArr = [];
    private MAX_LENGTH = 100;
//    private duration = 500;
    //    var chart = realTimeLineChart();

    // 데이타용 변수 끝

    @HostListener('window:resize', [])
    onResize() {
    //    this.windowResize();
    }

    constructor() { // private decimalPipe: DecimalPipe

    }

    public ngOnInit(): void {
    //    this.init();
        this.createData();
        this.element = this.chartContainer.nativeElement;
        this.svg = d3.select(this.element).append('svg');
    }


    // 임시 데이타 만들기 시작
    private createData() {
        this.seedData();
        setInterval(() => {
            this.updateData();
        }, 500);


    }

    private randomNumberBounds(min, max) {
      return Math.floor(Math.random() * max) + min;
    }

    private seedData() {
      const now = new Date();
      for (let i = 0; i < this.MAX_LENGTH; ++i) {
        this.lineArr.push({
          time: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
          x: this.randomNumberBounds(0, 5),
          y: this.randomNumberBounds(0, 2.5),
          z: this.randomNumberBounds(0, 10)
        });
      }
    }

    private updateData() {
      const now = new Date();

      const lineData = {
        time: now,
        x: this.randomNumberBounds(0, 5),
        y: this.randomNumberBounds(0, 2.5),
        z: this.randomNumberBounds(0, 10)
      };
      this.lineArr.push(lineData);

      if (this.lineArr.length > 30) {
        this.lineArr.shift();
      }

      this.draw();

    //  d3.select('#chart').datum(lineArr).call(chart);
    }

    // function resize() {
    //   if (d3.select('#chart svg').empty()) {
    //     return;
    //   }
    //   chart.width(+d3.select('#chart').style('width').replace(/(px)/g, ''));
    //   d3.select('#chart').call(chart);
    // }

    // 임시 데이타 만들기 끝

    // 차트 그리기
    private draw() {
        const data = ['x', 'y', 'z'].map((c) => {
                return {
                  label: c,
                  values: this.lineArr.map((d: any) => {
                    return {time: +d.time, value: d[c]};
                  })
                };
              });


        console.log(data);
        const t = d3.transition().duration(this.duration).ease(d3.easeLinear);
        const x = d3.scaleTime().rangeRound([0, this.width - this.margin.left - this.margin.right]);
        const y = d3.scaleLinear().rangeRound([this.height - this.margin.top - this.margin.bottom, 0]);
        const z = d3.scaleOrdinal(this.color);
    //
        const xMin = d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.time; })});
        const xMax = new Date(new Date(d3.max(data, function(c) {
        return d3.max(c.values, function(d) { return d.time; })
        })).getTime() - (this.duration * 2));
    //
        x.domain([xMin, xMax]);
        y.domain([
        d3.min(data, function(c) { return d3.min(c.values, function(d) { return d.value; })}),
        d3.max(data, function(c) { return d3.max(c.values, function(d) { return d.value; })})
        ]);
        z.domain(data.map(function(c) { return c.label; }));
        //
        const line = d3.line()
        .curve(d3.curveBasis)
        .x(function(d) { return x(d.time); })
        .y(function(d) { return y(d.value); });
    //
    //   var svg = d3.select(this).selectAll('svg').data([data]);
        // const svg = d3.select(this.element).append('svg').data([data]);
     const svg = this.svg;
      const gEnter = this.svg.data([data]).enter().append('svg').append('g');
      gEnter.append('g').attr('class', 'axis x');
      gEnter.append('g').attr('class', 'axis y');
      gEnter.append('defs').append('clipPath')
          .attr('id', 'clip')
        .append('rect')
          .attr('width', this.width-this.margin.left-this.margin.right)
          .attr('height', this.height-this.margin.top-this.margin.bottom);

      gEnter.append('g')
          .attr('class', 'lines')
          .attr('clip-path', 'url(#clip)')
        .selectAll('.data').data(data).enter()
          .append('path')
            .attr('class', 'data');

      const legendEnter = gEnter.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (this.width-this.margin.right-this.margin.left-75) + ',25)');
      legendEnter.append('rect')
        .attr('width', 50)
        .attr('height', 75)
        .attr('fill', '#ffffff')
        .attr('fill-opacity', 0.7);
      legendEnter.selectAll('text')
        .data(data).enter()
        .append('text')
          .attr('y', function(d, i) { return (i*20) + 25; })
          .attr('x', 5)
          .attr('fill', function(d) { return z(d.label); });

    //   var svg = selection.select('svg');
      svg.attr('width', this.width).attr('height', this.height);
      const g = svg.select('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

      g.select('g.axis.x')
        .attr('transform', 'translate(0,' + (this.height-this.margin.bottom-this.margin.top) + ')')
        .transition(t)
        .call(d3.axisBottom(x).ticks(5));
      g.select('g.axis.y')
        .transition(t)
        .attr('class', 'axis y')
        .call(d3.axisLeft(y));

      g.select('defs clipPath rect')
        .transition(t)
        .attr('width', this.width-this.margin.left-this.margin.right)
        .attr('height', this.height-this.margin.top-this.margin.right);

      g.selectAll('g path.data')
        .data(data)
        .style('stroke', function(d) { return z(d.label); })
        .style('stroke-width', 1)
        .style('fill', 'none')
        .transition()
        .duration(this.duration)
        .ease(d3.easeLinear)
        .on('start', tick);

      g.selectAll('g .legend text')
        .data(data)
        .text(function(d) {
          return d.label.toUpperCase() + ': ' + d.values[d.values.length-1].value;
        });

    //   // For transitions https://bl.ocks.org/mbostock/1642874
     function tick() {
    //     d3.select(this)
    //       .attr('d', function(d) { return line(d.values); })
    //       .attr('transform', null);
    //
    //     var xMinLess = new Date(new Date(xMin).getTime() - this.duration);
    //     d3.active(this)
    //         .attr('transform', 'translate(' + x(xMinLess) + ',0)')
    //       .transition()
    //         .on('start', tick);
       }
    // });
    }
    //
    // chart.margin = function(_) {
    //     if (!arguments.length) return margin;
    //     margin = _;
    //     return chart;
    //   };
    //
    //   chart.width = function(_) {
    //     if (!arguments.length) return width;
    //     width = _;
    //     return chart;
    //   };
    //
    //   chart.height = function(_) {
    //     if (!arguments.length) return height;
    //     height = _;
    //     return chart;
    //   };
    //
    //   chart.color = function(_) {
    //     if (!arguments.length) return color;
    //     color = _;
    //     return chart;
    //   };
    //
    //   chart.duration = function(_) {
    //     if (!arguments.length) return duration;
    //     duration = _;
    //     return chart;
    //   };
    //
    //   return chart;
    // }

}
