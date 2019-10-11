<template>
  <v-container>
    <v-layout row wrap justify-end>
      <v-spacer></v-spacer>
      <v-flex xs3>
        <v-select
          :items="items"
          label="Duration"
          v-model="duration"
          @change="fetchData"
          item-value="id"
          item-text="display"
          class="ma-3"
        ></v-select>
      </v-flex>
      <v-btn text icon color="green" class="ma-6" v-on:click="refresh">
        <v-icon>mdi-cached</v-icon>
      </v-btn>
    </v-layout>
    <v-layout text-center wrap>
      <v-flex xs12>
        <highcharts class="chart" :options="chartOptions" :updateArgs="updateArgs"></highcharts>
      </v-flex>
    </v-layout>
    <v-dialog v-model="loading" fullscreen full-width>
      <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import Highcharts from "highcharts";

Highcharts.setOptions({
  global: {
    useUTC: false
  }
});
export default {
  data() {
    return {
      duration: "",
      updateArgs: [true, true, { duration: 1000 }],
      loading: false,

      items: [
        { id: "week", display: "1 Week" },
        { id: "month", display: "1 Month" },
        { id: "1hour", display: "1 Hour" },
        { id: "5hours", display: "5 Hours" }
      ],
      title: "Transcations",
      chartOptions: {
        chart: {
          type: "bubble"
        },
        title: {
          text: "Transcations"
        },
        xAxis: {
          // type: "datetime",
          tickInterval: 1000 * 60 * 15,
          labels: {
            formatter: function() {
              return Highcharts.dateFormat("%H:%M", this.value);
            }
          }
        },
        yAxis: {
          title: {
            text: "Average Transcation Amount"
          },
          labels: {
            format: "{value:.2f}"
          }
        },
        plotOptions: {
          bubble: {
            tooltip: {
              pointFormat: "Avg Transcation amount {point.y}"
            }
          },
          series: {
            pointInterval: 1000 * 60 * 15 //data every 15 minutes
          }
        },
        series: [
          {
            data: [],
            name: "Transcation data"
          }
        ]
      }
    };
  },
  created() {
    this.duration = "1hour";
    this.fetchData();
  },
  watch: {},
  methods: {
    formatData: function(timeData) {
      let finalData = [];
      for (var data of timeData) {
        finalData.push({ x: data["_id"]["$date"], y: data["total_amount"] });
      }
      let series = { data: finalData };
      this.chartOptions.series = [series];
    },
    fetchData: function() {
      this.loading = true;
      axios
        .get("api/data?duration=" + this.duration)
        .then(response => {
          this.loading = false;
          this.formatData(response.data);
        })
        .catch(error => {
          this.loading = false;
        });
    },
    refresh: function() {
      this.duration = "week";
      this.fetchData();
    }
  }
};
</script>

<style scoped>
</style>
