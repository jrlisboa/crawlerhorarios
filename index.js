var request = require('request');
var cheerio = require('cheerio');
var URL = require('url-parse');

var firstPage = "https://www.rapidocampinas.com.br/linhas_horarios/SiteApps/linha/index.asp";
console.log("Visiting page " + firstPage);
request(firstPage, function(error, response, body) {
   if(error) {
     console.log("Error: " + error);
   }
   console.log("Status code: " + response.statusCode);
   if(response.statusCode === 200) {
     var $ = cheerio.load(body);
     console.log("Page title:  " + $('title').text());

     console.log("Empresas disponíveis:");
     var empresas = $('#selEmpresa option').each(function(){
         if ($(this).text() !== '--- selecione a empresa ---') {
             console.log($(this).text());
         }
     });
   }

   console.log("---------------------");
   console.log("Sistemas disponíveis:");

   for (var i = 1; i < 100; i++) {
       request(firstPage + '?empresaSelecionada=10' + i, function(error, response, body) {
          if(error) {
            console.log("Error: " + error);
          }
          if(response.statusCode === 200) {
            var $ = cheerio.load(body);
            var sistemas = $('#selSistema option').each(function(a){
               if (a > 0) {
                   console.log($(this).text() + '###');
                   console.log("Linhas disponíveis:");

                   request(firstPage + '?empresaSelecionada=10' + i + '&sistemaSelecionado=' + a,
                   function(error, response, body) {
                      if(error) {
                        console.log("Error: " + error);
                      }
                      if(response.statusCode === 200) {
                        var $ = cheerio.load(body);
                        var linhas = $('table.borda_fina_tabela').each(function(){
                           if ($(this).text() !== ('PREFIXO' || 'NOME DA LINHA')) {
                               console.log($(this).text() + ' ####');
                           }
                        });
                      }
                   });
               }

               console.log("---------------------");
            });
          }
      });
   }
});
