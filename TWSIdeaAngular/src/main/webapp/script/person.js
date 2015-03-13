var app = angular.module('persons', ['ngResource', 'ngGrid', 'ui.bootstrap']);

// Criar um controlador com o nome personsListController de se ligar à secção de lista
app.controller('personsListController', function ($scope, $rootScope, personService) {
    // Inicializar informações necessárias: a classificação , a primeira página para mostrar e as opções de lista.
    $scope.sortInfo = {fields: ['id'], directions: ['asc']};
    $scope.persons = {currentPage: 1};

    $scope.gridOptions = {
        data: 'persons.list',
        useExternalSorting: true,
        sortInfo: $scope.sortInfo,

        columnDefs: [
            { field: 'id', displayName: 'Id' },
            { field: 'name', displayName: 'Nome' },
            { field: 'description', displayName: 'Descrição' },
            { field: '', width: 30, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="deleteRow(row)"></span>' }
        ],

        multiSelect: false,
        selectedItems: [],
        // Broadcasts um evento quando uma linha é selecionada, para assinalar a forma que ele precisa para carregar os dados da linha .
        afterSelectionChange: function (rowItem) {
            if (rowItem.selected) {
                $rootScope.$broadcast('personSelected', $scope.gridOptions.selectedItems[0].id);
            }
        }
    };

    // Atualize o grid, chamando o método descanso adequado .
    $scope.refreshGrid = function () {
        var listPersonsArgs = {
            page: $scope.persons.currentPage,
            sortFields: $scope.sortInfo.fields[0],
            sortDirections: $scope.sortInfo.directions[0]
        };

        personService.get(listPersonsArgs, function (data) {
            $scope.persons = data;
        })
    };

    // Broadcast um evento quando um elemento da rede é eliminado . Não há qualquer supressão real é perfomed neste momento.
    $scope.deleteRow = function (row) {
        $rootScope.$broadcast('deletePerson', row.entity.id);
    };

    // Assista a variável SortInfo . Se forem detectadas alterações do que precisamos para atualizar a grade.
    // Isso também funciona para o primeiro acesso à página , uma vez que nós atribuímos a triagem inicial na seção initialize .
    $scope.$watch('sortInfo.fields[0]', function () {
        $scope.refreshGrid();
    }, true);

    // Faça alguma coisa quando a grade está classificada.
    // A lista lança o ngGridEventSorted que se apanhada aqui e atribui o SortInfo ao alcance .
    // Isto irá permitir a assistir o SortInfo no âmbito alterada e para actualizar a lista.
    $scope.$on('ngGridEventSorted', function (event, sortInfo) {
        $scope.sortInfo = sortInfo;
    });

    // Escolhas do evento transmitido quando uma pessoa é salva ou suprimido para atualizar os elementos da rede com a mais
    // informações atualizadas.
    $scope.$on('refreshGrid', function () {
        $scope.refreshGrid();
    });

    // Escolhas do evento transmitido quando o formulário é liberado para também limpar a seleção grid.
    $scope.$on('clear', function () {
        $scope.gridOptions.selectAll(false);
    });
});

// Criar um controlador com nome personsFormController para ligar para a seção de formulário.
app.controller('personsFormController', function ($scope, $rootScope, personService) {
    // Limpa o formulário. Ou clicando no botão "Limpar" na forma , ou quando um arquivo é salvo com sucesso .
    $scope.clearForm = function () {
        $scope.person = null;
        //Redefine o estado de validação de formulário
        $scope.personForm.$setPristine();
        // Broadcast o evento também para limpar a seleção grid.
        $rootScope.$broadcast('clear');
    };

    // Chama o método descanso para salvar uma pessoa.
    $scope.updatePerson = function () {
        personService.save($scope.person).$promise.then(
            function () {
                //Transmitir o evento para atualizar a grade.
                $rootScope.$broadcast('refreshGrid');
                // Broadcast o evento para exibir uma mensagem de salvamento .
                $rootScope.$broadcast('personSaved');
                $scope.clearForm();
            },
            function () {
                // Broadcast o evento para um erro no servidor.
                $rootScope.$broadcast('error');
            });
    };

    // Pega o evento transmitido quando a pessoa é seleccionado de entre a grade e realizar a carga pessoa chamando
    // o serviço de descanso apropriado .
    $scope.$on('personSelected', function (event, id) {
        $scope.person = personService.get({id: id});
    });

    // Nos escolhe o evento transmitido quando a pessoa é excluída da rede e realizar a pessoa real por excluir
    // Chamar o serviço de descanso apropriado .
    $scope.$on('deletePerson', function (event, id) {
        personService.delete({id: id}).$promise.then(
            function () {
                // Broadcast o evento para atualizar a grid
                $rootScope.$broadcast('refreshGrid');
                // Broadcast o evento para exibir uma mensagem de exclusão.
                $rootScope.$broadcast('personDeleted');
                $scope.clearForm();
            },
            function () {
                // Broadcast o evento para um erro no servidor.
                $rootScope.$broadcast('error');
            });
    });
});

// Criar um controlador com nome alertMessagesController para ligar para a seção de mensagens de feedback .
app.controller('alertMessagesController', function ($scope) {
    // Pega o evento para exibir uma mensagem gravada.
    $scope.$on('personSaved', function () {
        $scope.alerts = [
            { type: 'success', msg: 'Rigistro salvo com sucesso' }
        ];
    });

    // Pega o evento para exibir uma mensagem excluída .
    $scope.$on('personDeleted', function () {
        $scope.alerts = [
            { type: 'success', msg: 'Registro deletado com sucesso' }
        ];
    });

    // Pega o evento para exibir uma mensagem de erro no servidor.
    $scope.$on('error', function () {
        $scope.alerts = [
            { type: 'danger', msg: 'Erro interno no servidor!' }
        ];
    });

    $scope.closeAlert = function (index) {
        $scope.alerts.splice(index, 1);
    };
});

// Serviço que permite operações de pessoas
app.factory('personService', function ($resource) {
    return $resource('resources/persons/:id');
});
