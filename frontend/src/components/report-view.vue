<template>
  <div id="report-view">
    <h4>{{ createReportLine(reports) }}</h4>
    <table>
      <thead>
        <tr>
          <th>Park</th>
          <th>Rating</th>
          <th>Submitted</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="report in reports" 
            :key="report.id" 
            v-bind:class="`star${report.rating}`"
        >
          <td>{{ report.parkName }}</td>
          <td>{{ report.rating }}</td>
          <td>{{ createDate(report.updatedAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ReportView',
  props: {
    reports: Array,
    createReportLine: Function,
    createDate: Function,
  }
}
</script>

<style lang="scss">
#report-view {
  table {
    width: 100%;
    margin: 0 auto;
    border: 3px solid black;
    border-collapse: collapse;
    th {
      padding: 1.5em;
      background-color: #B89587;
      border: 1px solid black;
    }
    td {
      padding: 1em;
      border: 1px solid black;
      color: black;
    }
    .star1 {
      background-color: #A8081E;
    }
    .star2 {
      background-color: #B55809;
    }
    .star3 {
      background-color: #4E9A90;
    }
    .star4 {
      background-color: #36774E;
    }
    .star5 {
      background-color: #097611;
    }
  }
}
</style>


