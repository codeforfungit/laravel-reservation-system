<template>
<div class="container">
  <div class="row">
      <div class="col-md-12">
        <div class="jumbotron">
          <h1>教室: {{ classroom.name }}</h1>
          <p>方案: {{ plan.name }}</p>
        </div>
      </div>
  </div>

  <div class="row">
    <div class="block">
      <span class="demonstration">預約日期</span>
      <el-date-picker
        v-model="reservedDate"
        type="date"
        placeholder="請選擇"
        :size="'large'"
        :picker-options="pickerOptions">
      </el-date-picker>
      <a v-if="selectedSectionIndex !== null" class="btn btn-primary">{{ selectedSection.text }}</a>
      <a @click="sendReserve" v-if="reservedStartDateTime && reservedEndDateTime" class="btn btn-default">送出預約</a>
    </div>
  </div>

</div>  
</template>

<<script>
export default {
  props: ['classroom', 'plan', 'reservations'],

  mounted () {
    this.sections = [{
      text: '早上(10:00~12:00)',
      startTime: 10,
      endTime: 12
    }, {
      text: '下午(13:00~15:00)',
      startTime: 13,
      endTime: 15
    }, {
      text: '傍晚(16:00~18:00)',
      startTime: 16,
      endTime: 18
    }]

    this.pickerOptions = {
      shortcuts: [{
        text: '請先選擇時段'
      },{
        text: this.sections[0].text,
        onClick: this.getShortcutCallback(0)
      }, {
        text: this.sections[1].text,
        onClick: this.getShortcutCallback(1)
      }, {
        text: this.sections[2].text,
        onClick: this.getShortcutCallback(2)
      }],
      disabledDate: this.disabledDate
    }
  },

  data () {
    return {
      sections: [],
      pickerOptions: {},
      reservedDate: null,
      selectedSectionIndex: null,
    }
  },

  computed: {
    selectedSection () {
      if (this.selectedSectionIndex !== null) {
        return this.sections[this.selectedSectionIndex]
      } else {
        return null
      }
    },
    reservedStartDateTime () {
      if (this.reservedDate && this.selectedSectionIndex !== null) {
        return parseInt(this.reservedDate.setHours(this.selectedSection.startTime)) / 1000
      } else {
        return null
      }
    },
    reservedEndDateTime () {
      if (this.reservedDate && this.selectedSectionIndex !== null) {
        return parseInt(this.reservedDate.setHours(this.selectedSection.endTime)) / 1000
      } else {
        return null
      }
    }
  },

  methods: {
    disabledDate (date) {
      return true
    },

    getShortcutCallback (sectionIndex) {
      var self = this
      return function (picker) {
        self.selectedSectionIndex = sectionIndex
        picker.disabledDate = function (date) {

          // 找出是否有被預約
          var isReserved = self.reservations.some(reservationTimeString => {
            return new Date(reservationTimeString).getTime() === date.setHours(self.selectedSection.startTime)
          })

          return isReserved || 
                 date.setHours(self.selectedSection.startTime) < new Date() // 時間已超過
        }
      }
    },

    sendReserve () {
      this.$http.post('/reservations/' + this.plan.id, {
        start: this.reservedStartDateTime,
        end: this.reservedEndDateTime
      }).then(res => {
        window.location.href = '/reservations';
      }).catch(err => {
        console.error(err)
      })
    }

  }
}

</script>

