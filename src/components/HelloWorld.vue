<template>
  <v-container>
    <v-layout
      text-center
      wrap
    >
      <v-flex xs12>
        <v-col
          class="d-flex"
          cols="12"
          sm="6"
        >
          <v-select
            :items="items"
            label="Duration"
            solo
            v-model="duration"
            @change="fetchData"
            item-value="id"
            item-text="display"
          ></v-select>
        </v-col>
        <highcharts
          class="chart"
          :options="chartOptions"
          :updateArgs="updateArgs"
        ></highcharts>
      </v-flex>
    </v-layout>
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
              console.log(this.value);
              return Highcharts.dateFormat("%H:%M", this.value);
            }
          }
        },
        plotOptions: {
          series: {
            pointInterval: 1000 * 60 * 15 //data every 15 minutes
          }
        },
        series: [
          {
            data: [{ x: 15706962000001, y: 368 }]
          }
        ]
      }
    };
  },
  created() {},
  watch: {},
  methods: {
    formatData: function(timeData) {
      let finalData = [];
      for (var data of timeData) {
        console.log(data);
        finalData.push({ x: data["_id"]["$date"], y: data["total_amount"] });
        // tmp_data.push(data["total_amount"]);
      }
      // finalData.push(tmp_data);
      console.log(finalData);
      let series = { data: finalData };
      this.chartOptions.series = [series];
    },
    fetchData: function() {
      axios
        .get("api/data?duration=" + this.duration)
        .then(response => {
          console.log(response.data);
          this.formatData(response.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>

<style scoped>
/* input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}
#colorPicker {
  border: 0;
  padding: 0;
  margin: 0;
  width: 30px;
  height: 30px;
}
.numberInput {
  width: 30px;
} */
</style>
