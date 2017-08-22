<template>
<div>
  <input id="flatpickr" class="flatpickr flatpickr-input" type="text" placeholder="Select Date.." readonly="readonly">
  <div v-if="isLoading" class="mask">
    <spinner message="Loading..."></spinner>
  </div>
</div>
</template>

<script>
// import FlatPickr from 'flatpickr'

//使用自己改過的code
import FlatPickr from '../lib/flatpickr' 
import { zh } from 'flatpickr/dist/l10n/zh'
import Spinner from 'vue-simple-spinner'

export default {
  components: {
    Spinner
  },

  props: {
    // 已設定為假日的日期, 應預選
    vocationCollections: {
      type: Array,
      default: []
    },

    // 已經被預約的日期, 應設定為無法選擇
    reservations: {
      type: Array,
      default: []
    },

    breadurl: {
      type: String
    }
  },

  mounted () {
    // 設定今天之前的日曆為無法瀏覽或選擇
    this.options.minDate = "today"

    // 從Server拿回的假期資料設定進日曆中預選取
    console.log(this.vocationCollections)
    this.vocationCollections.forEach(vocation => {
      // 設定單一日期為假日
      if (vocation.start === vocation.end) {
        this.vocations.push({
          start: (new Date(vocation.start)).toDateString(),
          id: vocation.id
        })
      } else {
        // 目前不支援日期區段的假日設定
      }
    })

    // 從Server拿回的預約資料, 設定進日曆中為不得選擇
    this.reservations.forEach(reservation => {
      this.reservationDateSet.add(reservation)
    })
    this.options.disable = Array.from(this.reservationDateSet)
    
    // 產生日曆instance
    this.flatPickr = new FlatPickr('#flatpickr', this.options)
  },

  data () {
    return {
      options: {
        // 取消隱藏
        inline: true,

        // 不得選擇的日期(已經被預約)
        disable: [],

        onChange: this.onChange,
        onDayCreate: this.onDayCreate
      },

      flatPickr: null,
      reservationDateSet: new Set(),
      vocations: [],
      isLoading: false
    }
  },

  methods: {
    // 選擇或取消日期, 因為一次只能選擇一天, 直接取用selectedDates[0]即可
    onChange (selectedDates, dateStr, instance) {
      var vocation = this.isVocation(selectedDates[0].toDateString())
      if (vocation) {
        // console.log('已經有被選過, 進行取消')
        this.deleteVocation(vocation.id)
      } else {
        // console.log('尚未選過, 加入到假日')
        this.addVocation(dateStr + ' 00:00:00', dateStr + ' 23:59:59')
      }
    },

    onDayCreate (dObj, dStr, fp, dayElem) {
      // 為vocation增加class
      // if(this.vocationDateStringSet.has(dayElem.dateObj.toDateString())) {
     var vocation = this.isVocation(dayElem.dateObj.toDateString())
      if (vocation) {
        dayElem.classList.add('vocation')
        dayElem.dataset.id = vocation.id
      }
    },

    isVocation (dateString) {
      return this.vocations.find( vocation => {
        return vocation.start === dateString
      })
    },

    addVocation (start, end) {
      this.isLoading = true
      this.$http.post(this.breadurl, {
        start,
        end
      }).then(res => {
        // post成功後加入月曆中
        this.vocations.push({
          start: (new Date(res.data.start)).toDateString(),
          id: res.data.id
        })
        this.flatPickr.redraw()
      }).catch(err => {
        console.error(err)
      }).then(() => {
        this.isLoading = false
      })
    },

    deleteVocation (id) {
      this.isLoading = true
      // this.$http.delete(this.breadurl + '/' + id)
      this.$http({
        method: 'delete',
        url: this.breadurl + '/' + id,
        data: {ajax: true}
      }).then(res => {
        // 完成刪除
        // 成功後從月曆中移除
        console.log(res)
        this.vocations = this.vocations.filter( vocation => {
          return vocation.id != id
        })
        this.flatPickr.redraw()
      }).catch(err => {
        // 刪除失敗
        console.error(err)
      }).then(() => {
        // finally
        this.isLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../css/flatpickr.css';
  
  // css for loading animation
  .mask {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    display: -webkit-flex;
    display:         flex;
    -webkit-align-items: center;
            align-items: center;
    -webkit-justify-content: center;
            justify-content: center;

    background-color: white;
    opacity: 0.85;
  }
</style>