new Ajax.Request('https://cors-anywhere.herokuapp.com/api.coinmarketcap.com/v1/ticker/?convert=CAD', {
    method:'get',
    onSuccess: (transport) => {
        console.log(transport.responseText);
    },
    onFailure: function() { alert('Something went wrong...'); }
});