new Vue({
	el: '#app',
	data: {
		db: {},
		cidades:[],
		cursos:[],
		filtros:{
			cidade:"",
			curso:"",
			tipo:[],
			valor:0
		},
		resultado:{},
		selecionadas:[],
		escolhidas:[],
		carregando:false,
		modalOpen:false

	},
	methods: {
		getJsonFile (index) {
			//this.db = './db.json'


			fetch("assets/js/db.json")
				.then(r => r.json())
				.then(json => {
					json.sort( function( a, b ) {
						a = a.university.name.toLowerCase();
						b = b.university.name.toLowerCase();
					
						return a < b ? -1 : a > b ? 1 : 0;
					});
				this.db=json;
				this.get_cidades();
				this.get_cursos();
				this.filtrar();
				},
			response => {
			console.log('Error loading json:', response)
			});
		},
		get_cidades(){
			let cidades = this.cidades;
			this.db.forEach(function (item) {
				if(!cidades.includes(item.campus.city))
					cidades.push(item.campus.city);
			});
			this.cidades=cidades;
		},
		get_cursos(){
			let cursos = this.cursos;
			this.db.forEach(function (item) {
				if(!cursos.includes(item.course.name))
					cursos.push(item.course.name);
			});
			this.cursos=cursos;
		},
		filtrar(){
			this.resultado=[];
			this.carregando=true;
			let t= this;
			t.db.forEach(function (item, index) {
				let aprovado= true
				if(t.filtros.cidade!="" && item.campus.city != t.filtros.cidade)
					aprovado= false;
				if(t.filtros.curso!="" && item.course.name != t.filtros.curso)
					aprovado = false;
				if(t.filtros.valor!=0 && item.price_with_discount > parseFloat(t.filtros.valor))
					aprovado = false;
				if(t.filtros.tipo.length > 0 && (!t.filtros.tipo.includes(item.course.kind)))
					aprovado = false;
				if(aprovado)
					t.resultado.push(item);
			});
			this.carregando=false;
			
		},
		cancelar(){
			this.selecionadas = [];
			this.modalOpen=false;
		},
		adicionar(){
			this.escolhidas = JSON.parse(JSON.stringify(this.selecionadas));
			this.selecionadas = [];
			this.modalOpen=false;
			window.localStorage.setItem('escolhidas', JSON.stringify(this.escolhidas));
		},
		obtemEscolhidas(){
			this.escolhidas = JSON.parse(window.localStorage.getItem('escolhidas'));
			
		},
		excluir(key){
			this.escolhidas.splice(key, 1);
			window.localStorage.setItem('escolhidas', JSON.stringify(this.escolhidas));
			
		}
    },

    mounted: function(){
		this.getJsonFile();
		this.obtemEscolhidas();
		

    }
  });
