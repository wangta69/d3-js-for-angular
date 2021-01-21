import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
// import { DecimalPipe } from '@angular/common';
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
export class LineTransitonComponent implements OnInit {
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
        console.log('==========consructor');
    }

    public ngOnInit(): void {
    //    this.init();
        this.createData();
        this.element = this.chartContainer.nativeElement;
        this.svg = d3.select(this.element).append('svg');

        const body = this.svg.append('g');
        const gEnter = this.svg.selectAll(); // data([data]).enter().append('svg').append('g');
        body.append('g').attr('class', 'axis x');
        body.append('g').attr('class', 'axis y');
        body.append('defs').append('clipPath')
            .attr('id', 'clip')
          .append('rect')
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height - this.margin.top - this.margin.bottom);

        body.append("clipPath")       // define a clip path
    	.attr("id", "clip-1") // give the clipPath an ID
        .append('rect')
          .attr('width', 350)
          .attr('height', 300);

      // .append("ellipse")            // shape it as an ellipse
    	// .attr("cx", 175)            // position the x-centre
    	// .attr("cy", 100)            // position the y-centre
    	// .attr("rx", 100)            // set the x radius
    	// .attr("ry", 50);


        body.append('g')
            .attr('class', 'lines')
            .attr('clip-path', 'url(#clip-1)')
            .append('path')
            .attr('class', 'data');


    }


    // 임시 데이타 만들기 시작
    private createData(): void  {
        this.seedData();
        setInterval(() => {
            this.updateData();
        }, this.duration);
    }

    private randomNumberBounds(min: number, max: number): void {
      return Math.floor(Math.random() * max) + min;
    }

    private seedData(): void {
      const now = new Date();
      for (let i = 0; i < this.MAX_LENGTH; ++i) {
        this.lineArr.push({
          time: new Date(now.getTime() - ((this.MAX_LENGTH - i) * this.duration)),
          x: this.randomNumberBounds(0, 5),
          y: this.randomNumberBounds(0, 2.5),
          z: this.randomNumberBounds(0, 10),
        });
      }
    }

    private updateData(): void {
      const now = new Date();

      const lineData = {
        time: now,
        x: this.randomNumberBounds(0, 5),
        y: this.randomNumberBounds(0, 2.5),
        z: this.randomNumberBounds(0, 10),
      };
      this.lineArr.push(lineData);

      if (this.lineArr.length > 30) {
        this.lineArr.shift();
      }
       console.log(lineData.time, lineData.x);
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
    private draw(): void {
    //    console.log('draw=======================');
        const duration = this.duration;
        const data = ['x'].map((c) => {
                return {
                  label: c,
                  values: this.lineArr.map((d: any) => {
                    return {time: +d.time, value: d[c]};
                  })
                };
              });

        const newData = this.duration;

    //    console.log(data);
        const t = d3.transition().duration(duration).ease(d3.easeLinear);
        const x = d3.scaleTime().rangeRound([0, this.width - this.margin.left - this.margin.right]);
        const y = d3.scaleLinear().rangeRound([this.height - this.margin.top - this.margin.bottom, 0]);
        const z = d3.scaleOrdinal(this.color);
    //
        const xMin = d3.min(data, (c) => d3.min(c.values, (d) => d.time));
        // const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() + 6000 - (duration * 2));

        // 현재 시간보다 duration 만큼 시간 반큼 제외한다. ()
        // 실제출력데이타 보다 그래프가 작다 (따라서 실제는 - 된 시간전의 데이타가 출력된다.)
        // const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() - duration);
        // const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() - (duration * 2));
        // const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() - (duration * 2));

    //    const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() + 30000 - (duration * 2));
    //
        x.domain([xMin, xMax]);
        y.domain([
            d3.min(data, (c) => d3.min(c.values, (d) => d.value)),
            d3.max(data, (c) => d3.max(c.values, (d) => d.value )),
        ]);
        z.domain(data.map((c) => c.label));
        //
        const line = d3.line()
        //    .curve(d3.curveBasis)
            .x((d) => x(d.time))
            .y((d) => y(d.value));
    //
    //   var svg = d3.select(this).selectAll('svg').data([data]);
        // const svg = d3.select(this.element).append('svg').data([data]);

    //   var svg = selection.select('svg');
        this.svg.attr('width', this.width).attr('height', this.height);
        const g = this.svg.select('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        this.svg.select('g.axis.x')
            .attr('transform', 'translate(0,' + (this.height - this.margin.bottom - this.margin.top) + ')')
            .transition(t)
            .call(d3.axisBottom(x).ticks(5));

        g.select('g.axis.y')
            .transition(t)
            .call(d3.axisLeft(y));

        g.select('defs clipPath rect')
            .transition(t)
            .attr('width', this.width - this.margin.left - this.margin.right)
            .attr('height', this.height - this.margin.top - this.margin.right);

        g.selectAll('g path.data')
            .data(data)
            .style('stroke', (d) => z(d.label))
            .style('stroke-width', 1)
            .style('fill', 'none')
            .transition()
            .duration(duration)
            .ease(d3.easeLinear)
            .on('start', tick);

    //   // For transitions https://bl.ocks.org/mbostock/1642874
        function tick(m: any, i: number, n: []): void {
            d3.select(n[i])
            .attr('d', (d) => line(d.values))
            .attr('transform', null);

            // 현재의 transation을
            const xMinLess = new Date(new Date(xMin).getTime() - duration);

        //    console.log(xMinLess);


            // const xMinLess = new Date(new Date(xMin).getTime() + 500 - duration);

            //최소시간에서 duration 만큼

            // const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() + 6000 - (duration * 2));
            // 최대시간에서 duration * 2 만큼 빼서 출력
            // const xMax = new Date(new Date(d3.max(data, (c) => d3.max(c.values, (d) => d.time))).getTime() - (duration * 2));

            d3.active(n[i])
                .attr('transform', 'translate(' + x(xMinLess) + ',0)')
                .transition()
                .on('start', tick);
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
