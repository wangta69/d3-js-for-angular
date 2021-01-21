import { Component, OnInit, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import * as d3 from 'd3';
import {deepAssign} from './util';

export interface ChartData {
    date: any;
    open: number;
    high: number;
    low: number;
    close: number;
}

@Component({
    template: `<div class="d3-chart" #chart></div>`,
    styleUrls: ['./chart.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit {
    @ViewChild('chart', {static: true}) private chartContainer: ElementRef;
    private element: any;
    // private chartData: ChartData[];
    private chartData: any;
    // private currentData: ChartData;
    // private margin: any = {top: 30, right: 30, bottom: 30, left: 70};

    private htmlLoaded = false;
//    private intervalContainer: any;

//    private _z: d3.ScaleOrdinal;
//    private _z = d3.scaleOrdinal<any, any>();
//    private _z = (k: any) => {};

    // 상위에서 set data를 통해 데이타를 받아 온다.
    public set data(newValue: any) {
        this.chartData = newValue;
        // if (newValue && newValue.length > 1) {
        //     this.chartData = ['close'].map((c) => {
        //         return {
        //           label: c,
        //           values: newValue.map((d: any) => {
        //             return {time: +d.time, value: d[c]};
        //           })
        //         };
        //       });
        // }
    }

    public draw() {
    }



    @HostListener('window:resize', [])
    onResize() {
    //    this.windowResize();
    }

    constructor() { // private decimalPipe: DecimalPipe
    }

    ngOnInit() {
        this.init();

    }

    private optionsInit() {
        // const flag = this.chartContainer.nativeElement.offsetHeight;
        if (!this.htmlLoaded) {
            setTimeout(() => {
                this.optionsInit();
            }, 200);
        } else {
            // this.updateChartLayout();
        }
    }

    private init() {
        const flag = this.chartContainer.nativeElement.offsetHeight;
        if (flag ) {
            this.element = this.chartContainer.nativeElement;
            this.drawGraph();
        } else {
            //  참이 아닐 경우 0.1초후 다시 초기화를 진행한다..
            setTimeout(() => {
                this.init();
            }, 100);
        }
    }


    // linde chart를 그린다.
    private drawGraph() {
        // console.log(this.chartData);
        const twidth = this.chartContainer.nativeElement.offsetWidth;
        const theight = this.chartContainer.nativeElement.offsetHeight;
        console.log('drawGraph');
        console.log(this.element);
        console.log(twidth, theight);
        const n = 60;
        const duration = 500;
        let now = Date.now() - duration;
        console.log('now:', now, Date.now());
        const _t = d3.transition().duration(duration).ease(d3.easeLinear);
    // const data = this.chartData;
    //     const data = d3.range(n).map(function() { return 0; }); // 0~0으로 x축(n값) 범위를 초기화한다.
        let count = 0;

        const data = d3.range(n).map(() => randomNumberBounds(0, 10) );

        const svg = d3.select(this.element).append('svg');
        svg.attr('width', twidth).attr('height', theight);

        const margin = {top: 20, right : 20, bottom: 20, left: 40};
        const width = +svg.attr('width') - margin.left - margin.right;
        const height = +svg.attr('height') - margin.top - margin.bottom;
        const g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        const x = d3.scaleTime() // 시간속성(scale Time) 사용. 그래프의 width에 맞추어 x축을 (n-2 = 0~241)로 나눈다.
            .domain([now - (n - 2) * duration, now - duration])
            .range([0, width]);

        const y = d3.scaleLinear() // 그래프의 height에 맞추어 y축을 -1~1로 나눈다.
            .domain([0, 10])
            .range([height, 0]);

        const line = d3.line() // svg line 설정
            .x((d, i) => x(now - (n - 1 - i) * duration))
            .y(d => {
                return y(d);
            });


        const axis = g.append('g')
            .attr('class', 'axis x')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(x.axis = d3.axisBottom(x));
            // .call(d3.axisBottom(x).ticks(5));

        g.append('g') // y축에 대한 그룹 엘리먼트 설정
            .attr('class', 'axis y')
            .attr('transform', 'translate(' + (width - 20 ) + ', 0)') // 살짝 오른쪽으로 밀고
            .call(d3.axisRight(y));

        g.append('g')
            .attr('clip-path', 'url(#clip)')
            .append('path') // path: 실제 데이터 구현 부
            .datum(data)
            .attr('class', 'line') // (CSS)
            .transition()
            .duration(duration)
        //    .attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')')
            .attr('stroke', '#67809f')
            .attr('stroke-width', 2)
            // .style('stroke', '#67809f')
            // .style('stroke-width', 2)
            .style('fill', 'none')
            .ease(d3.easeLinear)
            .on('start', tick);

        function randomNumberBounds(min: number, max: number): number {
            return Math.floor(Math.random() * max) + min;
        }
    //    mainchart.exit().remove();
        function tick(m: any, i: number, a: []) {
            console.log('tick');
            // console.log('tick', randomNumberBounds(0, 10));
            now = Date.now();
            x.domain([now - (n - 2) * duration, now - duration]);
            y.domain([0, d3.max(data)]);
            data.push(Math.min(30, randomNumberBounds(0, 10))); // 새로운 데이터 포인트를 뒤에 push.
            count = 0;

            d3.select(a[i]) // 기본 변환행렬 초기화
                .attr('d', line)
                .attr('transform', null); // 선을 다시 그린다.
                // .attr('stroke', '67809f')
                // .attr('stroke-width', 2)

            axis.transition() // x축 설정, transition화
                 .duration(duration)
                 .ease(d3.easeLinear)
                 .call(x.axis);

            d3.active(a[i]) // 변환행렬 설정
                .attr('transform', 'translate(' + x(now - (n - 1) * duration) + ')')  // 왼쪽으로 민다.
                .transition() // 변환 start
                .on('start', tick);

            data.shift(); // 이전 데이터 포인트를 앞으로 pop.
        }
    }

}
