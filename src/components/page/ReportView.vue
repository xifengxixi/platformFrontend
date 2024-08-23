<template>
  <div class="reportShow">
    <h1>Test Report: {{ html_report_name }}</h1>

    <h2>Summary</h2>
    <table id="summary">

      <tr>
        <th>START AT</th>
        <td colspan="4">{{ time.start_datetime }}</td>
      </tr>
      <tr>
        <th>DURATION</th>
        <td colspan="4">{{ time.duration }} seconds</td>
      </tr>
      <tr>
        <th>PLATFORM</th>
        <td>HttpRunner {{ platform.httprunner_version }} </td>
        <td>{{ platform.python_version }} </td>
        <td colspan="2">{{ platform.platform }}</td>
      </tr>
      <tr>
        <th>TOTAL</th>
        <th>SUCCESS</th>
        <th>FAILED</th>
        <th>ERROR</th>
        <th>SKIPPED</th>
      </tr>
      <tr>
        <td>{{ stat.testsRun }}</td>
        <td>{{ stat.successes }}</td>
        <td>{{ stat.failures }}</td>
        <td>{{ stat.errors }}</td>
        <td>{{ stat.skipped }}</td>
      </tr>
    </table>

    <h2>Details</h2>

    <template v-for="(detail, detail_index) in details">
      <h3>{{ detail.name }}</h3>
      <table :id="'suite_' + (detail_index + 1)" class="details">
        <tr>
          <th>base_url</th>
          <td colspan="2">{{ detail.base_url }}</td>
          <th colspan="2" class="detail">
            <a class="button" :href="'#suite_output_' + (detail_index + 1)">parameters & output</a>
            <div :id="'suite_output_' + (detail_index + 1)" class="overlay">
              <div class="popup">
                <h2>Parameters and Output</h2>
                <a class="close" :href="'#suite_' + (detail_index + 1)">&times;</a>
                <div class="content">
                  <div style="overflow: auto;">
                    <table>
                      <tr>
                        <th>variables</th>
                        <th>output</th>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </th>
        </tr>

        <tr>
          <td>TOTAL: {{ detail.stat.testsRun }}</td>
          <td>SUCCESS: {{ detail.stat.successes }}</td>
          <td>FAILED: {{ detail.stat.failures }}</td>
          <td>ERROR: {{ detail.stat.errors }}</td>
          <td>SKIPPED: {{ detail.stat.skipped }}</td>
        </tr>

        <tr>
          <th>Status</th>
          <th colspan="2">Name</th>
          <th>Response Time</th>
          <th>Detail</th>
        </tr>

        <template v-for="(record, record_index) in detail.records">
          <tr :id="'record_' + (detail_index + 1) + '_' + (record_index + 1)">
            <th :class="record.status" style="width:5em;">{{ record.status }}</th>
            <td colspan="2">{{ record.name }}</td>
            <td style="text-align:center;width:6em;">{{ record.meta_data.response.response_time_ms }} ms</td>
            <td class="detail">

              <a class="button" :href="'#popup_log_' + (detail_index + 1) + '_' + (record_index + 1)">log</a>
              <div :id="'popup_log_' + (detail_index + 1) + '_' + (record_index + 1)" class="overlay">
                <div class="popup">
                  <h2>Request and Response data</h2>
                  <a class="close" :href="'#record_' + (detail_index + 1) + '_' + (record_index + 1)">&times;</a>
                  
                  <div class="content">
                    <h3>Name: {{ record.name }}</h3>
                    <h3>Request:</h3>
                    <div style="overflow: auto">
                      <table>
                        <tr v-for="(request_v, request_k) in record.meta_data.request">
                          <th>{{ request_k }}</th>
                          <td v-if="request_k !== 'headers'">
                            {{ request_v }}
                          </td>
                          <td v-else>
                            <div v-for="(value, key) in request_v">
                              <strong>{{ key }}</strong>: {{ value }}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <h3>Response:</h3>
                    <div style="overflow: auto">
                      <table>
                        <tr v-for="(response_v, response_k) in record.meta_data.response">
                          <th>{{ response_k }}</th>
                          <td v-if="response_k !== 'headers'">
                            {{ response_v }}
                          </td>
                          <td v-else>
                            <div v-for="(value, key) in response_v">
                              <strong>{{ key }}</strong>: {{ value }}
                            </div>
                          </td>
                        </tr>
                      </table>
                    </div>

                    <h3>Validators:</h3>
                    <div style="overflow: auto">
                      <table>
                        <template v-for="(validator, index) in record.meta_data.validators">
                          <tr v-if="index === 0">
                            <template v-for="(v, k) in validator">
                              <th v-if="k !== 'check_result'">{{ k }}</th>
                            </template>
                          </tr>
                          <tr>
                            <template v-for="(v, k) in validator">
                              <template v-if="k == 'check'">
                                <td v-if="validator['check_result'] == 'pass'" class="passed">{{ v }}</td>
                                <td v-else class="failed">{{ v }}</td>
                              </template>
                              <template v-else-if="k !== 'check_result'">
                                <td>{{ v }}</td>
                              </template>
                            </template>
                          </tr>
                        </template>
                      </table>
                    </div>

                    <h3>Statistics:</h3>
                    <div style="overflow: auto">
                      <table>
                        <tr>
                          <th>content_size(bytes)</th>
                          <td>{{ record.meta_data.response.content_size }}</td>
                        </tr>
                        <tr>
                          <th>response_time(ms)</th>
                          <td>{{ record.meta_data.response.response_time_ms }}</td>
                        </tr>
                        <tr>
                          <th>elapsed(ms)</th>
                          <td>{{ record.meta_data.response.elapsed_ms }}</td>
                        </tr>

                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <a v-if="record.attachment" class="button"
                :href="'#popup_attachment_' + (detail_index + 1) + '_' + (record_index + 1)">traceback</a>
              <div :id="'popup_attachment_' + (detail_index + 1) + '_' + (record_index + 1)" class="overlay">
                <div class="popup">
                  <a class="close" :href="'#record_' + detail_index + '_' + record_index">&times;</a>
                  <div class="content">
                    <pre>{{ record.attachment }}</pre>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </template>

      </table>
    </template>

  </div>
</template>

<script>
import api from '@/api/report';
export default {
  name: 'reportShow',
  data() {
    return {
      report_id: null,
      html_report_name: '',
      time: Object,
      stat: Object,
      stat2: Object,
      platform: Object,
      details: Array,
    }
  },
  methods: {
    getData() {
      api.reportDetail(this.report_id)
        .then(response => {
          let summary = JSON.parse(response.data.summary)
          this.html_report_name = summary.html_report_name;
          this.time = summary.time;
          this.stat = summary.stat;
          this.platform = summary.platform;
          this.details = summary.details;
        })
        .catch(error => {
          if (typeof error === 'object' && error.hasOwnProperty('status_code')) {
            if (error.status_code === 404) {
              this.$router.push({ name: '404' })
            }
          } else {
            this.$message.error('服务器错误');
          }
        })
    },
  },
  mounted() {
    this.report_id = this.$route.params.id;
    this.getData()
  }
};

</script>

<style scoped>
.reportShow {
  background-color: #f2f2f2;
  color: #333;
  margin: 20px auto;
  width: 960px;
}

#summary {
  width: 960px;
  margin-bottom: 20px;
}

#summary th {
  background-color: skyblue;
  padding: 5px 12px;
}

#summary td {
  background-color: lightblue;
  text-align: center;
  padding: 4px 8px;
}

.details {
  width: 960px;
  margin-bottom: 20px;
}

.details th {
  background-color: skyblue;
  padding: 5px 12px;
}

.details tr .passed {
  background-color: lightgreen;
}

.details tr .failed {
  background-color: red;
}

.details tr .unchecked {
  background-color: gray;
}

.details td {
  background-color: lightblue;
  padding: 5px 12px;
}

.details .detail {
  background-color: lightgrey;
  font-size: smaller;
  padding: 5px 10px;
  text-align: center;
}

.details .success {
  background-color: greenyellow;
}

.details .error {
  background-color: red;
}

.details .failure {
  background-color: salmon;
}

.details .skipped {
  background-color: gray;
}

.button {
  font-size: 1em;
  padding: 6px;
  width: 4em;
  text-align: center;
  background-color: #06d85f;
  border-radius: 20px/50px;
  cursor: pointer;
  transition: all 0.3s ease-out;
}

a.button {
  color: gray;
  text-decoration: none;
}

.button:hover {
  background: #2cffbd;
}

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 500ms;
  visibility: hidden;
  opacity: 0;
}

.overlay:target {
  visibility: visible;
  opacity: 1;
  overflow: scroll;
}

.popup {
  margin: 70px auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  width: 50%;
  position: relative;
  transition: all 3s ease-in-out;
}

.popup h2 {
  margin-top: 0;
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}

.popup .close {
  position: absolute;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: #333;
}

.popup .close:hover {
  color: #06d85f;
}

.popup .content {
  max-height: 80%;
  overflow: auto;
  text-align: left;
  padding-bottom: 20px;
}

@media screen and (max-width: 700px) {
  .box {
    width: 70%;
  }

  .popup {
    width: 70%;
  }
}
</style>