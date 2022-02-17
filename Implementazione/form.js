const questions = 
    {
        name: 'id',
        type: 'input',
        message: 'inserire id del prodotto: ',
        validate: function (value) {
            if (value.length) {
                return true;
            } else {
                return 'inserire id del prodotto';
            }
        }
    }