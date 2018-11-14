<template>
  <div id="report-view">
    <h3>{{ createReportLine(reports) }}</h3>
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

</style>


