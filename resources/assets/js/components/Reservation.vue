<template>
<div class="container">
  <div class="row">
      <div class="col-md-12">
        <div class="jumbotron">
          <h1>教室: {{ classroom.name }}</h1>
          <p>方案: {{ plan.name }}</p>
          <p>費用: {{ plan.price }}</p>
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
    </div>

    <div class=block>
      <el-checkbox-group v-model="checkedEquipment">
        <el-checkbox v-for="equipment in equipmentOptions" :label="equipment.id" :key="equipment.id">{{ equipment.name + '(' + equipment.price + ')' }}</el-checkbox>
      </el-checkbox-group>
    </div>

    <div class=block v-if="reservedStartDateTime && reservedEndDateTime">
      <span>價格預估: {{ estimated }}</span>
      <a @click="sendReserve" class="btn btn-default">送出預約</a>
    </div>
  </div>

</div>  
</template>

<<script>
export default {
  props: ['classroom', 'plan', 'reservations', 'equipment'],

  mounted () {
    // 設定可預約時段
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

    // 設定設備清單
    var tempArray = []
    this.equipment.forEach(item => {
      // this.equipmentOptions.names.push(item.name)
      // this.equipmentOptions.prices.push(item.price)
      // this.equipmentOptions.keys.push(item.id)
      tempArray.push({
        name: item.name,
        price: item.price,
        id: item.id
      })
    })
    this.equipmentOptions = tempArray

  },

  data () {
    return {
      sections: [],
      pickerOptions: {},
      reservedDate: null,
      selectedSectionIndex: null,
      equipmentOptions: [],
      checkedEquipment: []
    }
  },

  computed: {
    estimated () {
      var equipmentEstimate = 0;
      this.checkedEquipment.forEach(id => {
        equipmentEstimate += this.equipmentOptions.find(equipment => { return equipment.id === id }).price
      })
      return this.plan.price + equipmentEstimate
    },
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
        end: this.reservedEndDateTime,
        equipment: this.checkedEquipment
      }).then(res => {
        // console.log(res)
        window.location.href = '/reservations';
      }).catch(err => {
        console.error(err)
      })
    }

  }
}

</script>

