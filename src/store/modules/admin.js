export default {
  state: {
    semesterSelect: ''
  },
  mutations: {
    setSemester (state, semester) {
      state.semesterSelect = semester
    }
  },
  getters: {
    semesterSelect (state) {
      return state.semesterSelect
    }
  }
}
