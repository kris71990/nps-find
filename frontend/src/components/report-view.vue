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
          <td>{{ report.parkId }}</td>
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
    }
    .star1 {
      background-color: #D12727;
    }
    .star2 {
      background-color: #B95B0D;
    }
    .star3 {
      background-color: #BDBA5E;
    }
    .star4 {
      background-color: #30B08D;
    }
    .star5 {
      background-color: #1B9399;
    }
  }
}
</style>


