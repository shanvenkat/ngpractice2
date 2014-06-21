
myapp.controller('restuarantController', function ($scope, $resource, $filter) {

    $scope.currentPage = 1;
    $scope.exploreNearby = "New York";
    $scope.exploreQuery = "";
    $scope.filterValue = "";

    //paging   
    $scope.pageSize = '10';
    $scope.pagedItems = [];
    $scope.filteredItems = [];
    $scope.places = [];

    init();
    function init() {
        createWatche();
        getPlaces();
    }

    function getPlaces() {
        var requestParms = {
            clientId: "DO5JJHGXBODWHZUZ2W45T0S35PKJH3MCLC1SKF5U4X3VF4YA",
            clientSecret: "GF0PDCNGEKSU2GI4ANGBGBKTEUU0G3E3QYPO5YWFXRV33GY5",
            version: "20131230"
        }

        var offset = ($scope.pageSize) * ($scope.currentPage - 1);
        var resource = $resource("https://api.foursquare.com/v2/venues/:action",
        {
            action: 'explore',
            client_id: requestParms.clientId,
            client_secret: requestParms.clientSecret,
            v: requestParms.version,
            venuePhotos: '1',
            callback: "JSON_CALLBACK"
        },
        {
            getPlaces: { method: "JSONP", params: { near: $scope.exploreNearby, query: $scope.exploreQuery, limit: $scope.pageSize, offset: offset} }
        }
        );

        resource.getPlaces().$promise.then(
                            function (Places) {
                                $scope.places = Places.response.groups[0].items;
                                $scope.totalRecordsCount = Places.response.totalResults;
                                $scope.totalPagestoBrowse = $scope.totalRecordsCount / $scope.pageSize;
                                if ($scope.totalRecordsCount > 100) {
                                    $scope.buttonstoDisplay = 10;
                                }
                                else if ($scope.totalRecordsCount > 50 && $scope.totalRecordsCount < 100) {
                                    $scope.buttonstoDisplay = 5;
                                }
                                else {
                                    $scope.buttonstoDisplay = 2;
                                }

                                if ($scope.totalPagestoBrowse <= $scope.buttonstoDisplay) {
                                    $scope.totalPagestoBrowse = $scope.buttonstoDisplay;
                                }                                
                                filterPlaces('');
                            },
                            function (error) {
                                console.log(error);
                            }
                        );
    };

    $scope.buildVenueThumbnail = function (photo) {
        return photo.items[0].prefix + '128x128' + photo.items[0].suffix;
    };

    $scope.pageChanged = function (page) {
        $scope.currentPage = page;
        getPlaces();
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            getPlaces();
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPagestoBrowse) {
            $scope.currentPage++;
            getPlaces();
        }
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
        getPlaces();
    };

    $scope.lastPage = function () {
        if ($scope.currentPage = $scope.totalPagestoBrowse) {
            getPlaces();
        }
    };

    $scope.firstPage = function () {
        if ($scope.currentPage = 1) {
            getPlaces();
        }
    };


    $scope.range = function (start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 1;
        }
        for (var i = start; i <= end; i++) {
            ret.push(i);
        }
        return ret;
    };

    function createWatche() {
        $scope.$watch("filterValue", function (filterInput) {
            filterPlaces(filterInput);
        });
    }

    function filterPlaces(filterInput) {
        $scope.filteredPlaces = $filter("placeNameCategoryFilter")($scope.places, filterInput);
        $scope.filteredPlacesCount = $scope.filteredPlaces.length;
    }

    $scope.doSearch = function () {
        $scope.currentPage = 1;
        getPlaces();
    };


});
 