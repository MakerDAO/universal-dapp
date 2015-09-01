function UniversalDapp (contracts) {
    this.$el = $('<div class="dapp" />');
    this.contracts = contracts;
    this.stateTrie = new EthVm.Trie();
    this.vm = new EthVm.VM(this.stateTrie);
    //@todo this does not calculate the gas costs correctly but gets the job done.
    this.identityCode = 'return { gasUsed: 1, return: opts.data, exception: 1 };';
    this.identityAddr = ethUtil.pad(new Buffer('04', 'hex'), 20)
    this.vm.loadPrecompiled(this.identityAddr, this.identityCode);
    this.secretKey = '3cd7232cd6f3fc66a57a6bedc1a8ed6c228fff0a327e169c2bcc5e869ed49511'
    this.publicKey = '0406cc661590d48ee972944b35ad13ff03c7876eae3fd191e8a2f77311b0a3c6613407b5005e63d7d8d76b89d5f900cde691497688bb281e07a5052ff61edebdc0'
    this.address = ethUtil.pubToAddress(new Buffer(this.publicKey, 'hex'));
    this.account = new EthVm.Account();
    this.account.balance = 'f00000000000000001';
    this.nonce = 0;
    this.stateTrie.put(this.address, this.account.serialize());
}
UniversalDapp.prototype.render = function () {
    if (this.contracts.length == 0) {
        this.$el.append( this.getABIInputForm() );
    } else {

        for (var c in this.contracts) {
            var $title = $('<span class="title"/>').text( this.contracts[c].name );
            var $contractEl = $('<div class="contract"/>');
            $contractEl.append( $title, this.getCreateInterface( $contractEl, this.contracts[c]) );
            
            this.$el.append( $contractEl );
        }
    }
    return this.$el;
}

UniversalDapp.prototype.getABIInputForm = function (){
    var self = this;
    var $el = $('<div class="setup" />');
    console.log( 'creating abi input form')
    var $nameInput = $('<input type="text" placeholder="ContractName" value="Avatar"/>')
    var $abiInput = $('<input type="text" placeholder="[json ABI interface]" value=\'[{"constant":false,"inputs":[{"name":"to","type":"address"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"kill","outputs":[{"name":"","type":"bool"}],"type":"function"},{"constant":false,"inputs":[],"name":"createWoT","outputs":[{"name":"wotContractAddress","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"key","type":"bytes32"}],"name":"get","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"bytes32"},{"name":"val","type":"address"}],"name":"set","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":false,"inputs":[{"name":"key","type":"bytes32"},{"name":"value","type":"bytes32"}],"name":"set","outputs":[{"name":"","type":"bytes32"}],"type":"function"}]\'/>')
    var $binaryInput = $('<input type="text" placeholder="COMPILED BINARY CONTRACT" value="60606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b6110ec806100406000396000f30060606040523615610074576000357c0100000000000000000000000000000000000000000000000000000000900480631a6952301461007657806341c0e1b51461009d57806347fca8d8146100be5780638eaa6ac0146100f5578063ba44593c1461011c578063f71f7a251461014957610074565b005b610087600480359060200150610176565b6040518082815260200191505060405180910390f35b6100a8600450610208565b6040518082815260200191505060405180910390f35b6100c96004506103f6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101066004803590602001506102a7565b6040518082815260200191505060405180910390f35b61013360048035906020018035906020015061036d565b6040518082815260200191505060405180910390f35b6101606004803590602001803590602001506102cf565b6040518082815260200191505060405180910390f35b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156102025781600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060019050610203565b5b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156102a357600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff600190506102a4565b5b90565b6000600160005060008381526020019081526020016000206000505490506102ca565b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103665781600160005060008581526020019081526020016000206000508190555060016000506000848152602001908152602001600020600050549050610367565b5b92915050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103ef576103e8838373ffffffffffffffffffffffffffffffffffffffff166001026102cf565b90506103f0565b5b92915050565b60006000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561052357604051610bc380610529833901809050604051809103906000f090508073ffffffffffffffffffffffffffffffffffffffff16631a69523033604051827c0100000000000000000000000000000000000000000000000000000000028152600401808273ffffffffffffffffffffffffffffffffffffffff1681526020019150506020604051808303816000876161da5a03f11561000257505050604051515061051a7f776f7400000000000000000000000000000000000000000000000000000000008261036d565b50809150610524565b5b5090560060606040525b33600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b610b83806100406000396000f300606060405236156100ab576000357c01000000000000000000000000000000000000000000000000000000009004806314d8c981146100ad5780631a695230146100d457806322fb3fb0146100fb578063284cc0a914610138578063292493931461015f57806341c0e1b51461018c578063438f503d146101ad578063be1c766b146101ea578063ca4fffad1461020b578063dc281aff14610232578063f8cdfbf814610269576100ab565b005b6100be600480359060200150610441565b6040518082815260200191505060405180910390f35b6100e56004803590602001506102a0565b6040518082815260200191505060405180910390f35b61010c6004803590602001506104e6565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b61014960048035906020015061067d565b6040518082815260200191505060405180910390f35b6101766004803590602001803590602001506107d3565b6040518082815260200191505060405180910390f35b610197600450610332565b6040518082815260200191505060405180910390f35b6101be600480359060200150610485565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6101f560045061042f565b6040518082815260200191505060405180910390f35b61021c600480359060200150610547565b6040518082815260200191505060405180910390f35b61023d6004506103d1565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b610274600450610400565b604051808273ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561032c5781600060006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506001905061032d565b5b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156103cd57600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16ff600190506103ce565b5b90565b6000600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506103fd565b90565b6000600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905061042c565b90565b6000600360005054905061043e565b90565b6000600460005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050600201600050549050610480565b919050565b6000600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060010160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1690506104e1565b919050565b6000600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060000160019054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050610542565b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141561067757600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060000160009054906101000a900460ff161561062d57600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060020160008181505480929190600101919050555061063a565b6106388260016108ff565b505b600460005060008373ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050600201600050549050610678565b5b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156107cd57600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060000160009054906101000a900460ff161561076457600460005060008373ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060020160008181505480929190600190039190505550610790565b61078e827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff6108ff565b505b600460005060008373ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506002016000505490506107ce565b5b919050565b6000600060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614156108f857600460005060008473ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060000160009054906101000a900460ff16156108af5781600460005060008573ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600050600201600050819055506108bb565b6108b983836108ff565b505b600460005060008473ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506002016000505490506108f9565b5b92915050565b60006000836000806000600460005060008573ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000506002016000505414151415610b7957600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff16925085600460005060008573ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff02191690830217905550608060405190810160405280600181526020018481526020016000815260200186815260200150600460005060008873ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060005060008201518160000160006101000a81548160ff0219169083021790555060208201518160000160016101000a81548173ffffffffffffffffffffffffffffffffffffffff0219169083021790555060408201518160010160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506060820151816002016000505590505085600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055506003600081815054809291906001019190505550600073ffffffffffffffffffffffffffffffffffffffff16600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415610b6f5785600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908302179055505b8493505050610b7c565b50505b509291505056"/>')
    var $createButton = $('<button />').text('Create DApp')
    $createButton.click(function(ev){
        self.contracts = [{name: $nameInput.val(), interface: $abiInput.val(), bytecode: $binaryInput.val() }]
        self.$el.empty().append( self.render() )
    })
    $el.append( $nameInput ).append( $abiInput ).append( $binaryInput ).append( $createButton )
    return $el;
}


UniversalDapp.prototype.getCreateInterface = function ($container, contract) {
    var self = this;
    var $createInterface = $('<div class="create"/>');
    var $newButton = this.getInstanceInterface( contract )
    var $atButton = $('<button class="at"/>').text('At Address').click( function(){ self.clickContractAt( self, $container, contract ) } );
    $createInterface.append( $atButton ).append( $newButton );
    return $createInterface;
}

UniversalDapp.prototype.getInstanceInterface = function (contract, address) {
    var self = this;
    console.log( contract )
    var abi = JSON.parse(contract.interface);
    var funABI = this.getConstructorInterface(abi);
    var $createInterface = $('<div class="createContract"/>');

    var appendFunctions = function (address, $el){
        
        var $instance = $('<div class="instance"/>');
        var $title = $('<span class="title"/>').text( contract.name + " at " + address.toString('hex') );
        $instance.append( $title );
        $.each(abi, function(i, funABI) {
            if (funABI.type != 'function') return;
            $instance.append(self.getCallButton({
                abi: funABI,
                address: address
            }));
        });
        ($el || $createInterface ).append( $instance )
    }

    

    if (!address) {
        $createInterface.append( this.getCallButton({
            abi: funABI,
            bytecode: contract.bytecode,
            appendFunctions: appendFunctions
        }));
    } else {
        appendFunctions( address, $el );
    }
    
    return $createInterface;
}

UniversalDapp.prototype.getConstructorInterface = function(abi) {
    var funABI = {'name':'','inputs':[],'type':'constructor','outputs':[]};
    for (var i = 0; i < abi.length; i++)
        if (abi[i].type == 'constructor') {
            funABI.inputs = abi[i].inputs || [];
            break;
        }
    return funABI;
}

UniversalDapp.prototype.getCallButton = function(args) {
    var self = this;
    // args.abi, args.bytecode [constr only], args.address [fun only]
    // args.appendFunctions [constr only]
    var isConstructor = args.bytecode !== undefined;
    var fun = new web3.eth.function(args.abi);
    var inputs = '';
    $.each(args.abi.inputs, function(i, inp) {
        if (inputs != '') inputs += ', ';
        inputs += inp.type + ' ' + inp.name;
    });
    var inputField = $('<input/>').attr('placeholder', inputs);
    var outputSpan = $('<div class="output"/>');
    var button = $('<button/>')
        .text(args.bytecode ? 'Create' : fun.displayName())
        .click(function() {
            var funArgs = $.parseJSON('[' + inputField.val() + ']');
            var data = fun.toPayload(funArgs).data;
            console.log( funArgs )
            if (data.slice(0, 2) == '0x') data = data.slice(2);
            if (isConstructor)
                data = args.bytecode + data.slice(8);
            outputSpan.text('...');
            console.log( data )
            self.runTx(data, args.address, function(err, result) {
                if (err)
                    outputSpan.text(err);
                else if (isConstructor) {
                    outputSpan.text(' Creation used ' + result.vm.gasUsed.toString(10) + ' gas.');
                    args.appendFunctions(result.createdAddress);
                } else {
                    var outputObj = fun.unpackOutput('0x' + result.vm.return.toString('hex'));
                    outputSpan.text(' Returned: ' + JSON.stringify(outputObj));
                }
            });
        });
    if (!isConstructor)
        button.addClass('runButton');
    var c = $('<div class="contractProperty"/>')
        .append(button);
    if (args.abi.inputs.length > 0)
        c.append(inputField);
    return c.append(outputSpan);
}

UniversalDapp.prototype.clickNewContract = function ( self, $contract, contract ) {
    $contract.append( self.getInstanceInterface(contract) );
}

UniversalDapp.prototype.clickContractAt = function ( self, $contract, contract ) {
    var address = prompt( "What Address is this contract at in the Blockchain? ie: '0xdeadbeaf...'" )   
    $contract.append( self.getInstanceInterface(contract, address ) );
}

UniversalDapp.prototype.runTx = function( data, to, cb) {
    console.log( "runtx data: ", data )
    console.log( "runtx to:", to )
    var tx = new EthVm.Transaction({
        nonce: new Buffer([this.nonce++]), //@todo count beyond 255
        gasPrice: '01',
        gasLimit: '3000000',
        to: to,
        data: data
    });
    tx.sign(new Buffer(this.secretKey, 'hex'));
    this.vm.runTx({tx: tx}, cb);
}