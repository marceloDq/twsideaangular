# Java EE 8 - Angular - Exemplo de aplicação #

### Para rodar ###

* Você precisa JDK 8 ou superior , Maven 3 e Wildfly 8 para executar o aplicativo .

* Construa o código usando Maven com o comando: `mvn clean install`.

* ## Deploy in Wildfly 8 ##

  * Copie o arquivo de TWSIdeaAngular.war diretório de destino para a pasta de instalação Wildfly /standalone/deployments

  * Start Wildfly 8 em http://localhost:8080/TWSIdeaAngular/

### Javascript Package (opcional) ###

* As bibliotecas JS necessários estão incluídos no projeto, mas também é possível gerenciá-los com os próximos passos.

* Você precisa NPM vá para http://nodejs.org/download/ para obter uma cópia .

* Após instalar execute o comando: `npm install`.

* Instale Grunt `npm install -g grunt-cli`  para mais informações http://gruntjs.com/getting-started.

* Execute o comando " grunt " para baixar todas as dependências da web e construir uma versão otimizada do projeto.
