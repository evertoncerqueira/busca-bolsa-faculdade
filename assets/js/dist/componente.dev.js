"use strict";

new Vue({
  el: '#app',
  data: {
    db: {},
    cidades: [],
    cursos: [],
    filtros: {
      cidade: "",
      curso: "",
      tipo: [],
      valor: 0
    },
    resultado: {},
    selecionadas: [],
    escolhidas: [],
    carregando: false,
    modalOpen: false
  },
  methods: {
    getJsonFile: function getJsonFile(index) {
      var _this = this;

      //this.db = './db.json'
      fetch("assets/js/db.json").then(function (r) {
        return r.json();
      }).then(function (json) {
        json.sort(function (a, b) {
          a = a.university.name.toLowerCase();
          b = b.university.name.toLowerCase();
          return a < b ? -1 : a > b ? 1 : 0;
        });
        _this.db = json;

        _this.get_cidades();

        _this.get_cursos();

        _this.filtrar();
      }, function (response) {
        console.log('Error loading json:', response);
      });
    },
    get_cidades: function get_cidades() {
      var cidades = this.cidades;
      this.db.forEach(function (item) {
        if (!cidades.includes(item.campus.city)) cidades.push(item.campus.city);
      });
      this.cidades = cidades;
    },
    get_cursos: function get_cursos() {
      var cursos = this.cursos;
      this.db.forEach(function (item) {
        if (!cursos.includes(item.course.name)) cursos.push(item.course.name);
      });
      this.cursos = cursos;
    },
    filtrar: function filtrar() {
      this.resultado = [];
      this.carregando = true;
      var t = this;
      t.db.forEach(function (item, index) {
        var aprovado = true;
        if (t.filtros.cidade != "" && item.campus.city != t.filtros.cidade) aprovado = false;
        if (t.filtros.curso != "" && item.course.name != t.filtros.curso) aprovado = false;
        if (t.filtros.valor != 0 && item.price_with_discount > parseFloat(t.filtros.valor)) aprovado = false;
        if (t.filtros.tipo.length > 0 && !t.filtros.tipo.includes(item.course.kind)) aprovado = false;
        if (aprovado) t.resultado.push(item);
      });
      this.carregando = false;
    },
    cancelar: function cancelar() {
      this.selecionadas = [];
      this.modalOpen = false;
    },
    adicionar: function adicionar() {
      this.escolhidas = JSON.parse(JSON.stringify(this.selecionadas));
      this.selecionadas = [];
      this.modalOpen = false;
      window.localStorage.setItem('escolhidas', JSON.stringify(this.escolhidas));
    },
    obtemEscolhidas: function obtemEscolhidas() {
      this.escolhidas = JSON.parse(window.localStorage.getItem('escolhidas'));
    },
    excluir: function excluir(key) {
      this.escolhidas.splice(key, 1);
      window.localStorage.setItem('escolhidas', JSON.stringify(this.escolhidas));
    }
  },
  mounted: function mounted() {
    this.getJsonFile();
    this.obtemEscolhidas();
  }
});