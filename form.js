/*
Carla Pérez Gavilán Del Castillo, A01023033
HW2 - Javascript Form 
04-04-2021 
*/


let allFields = [];
allFields['nombreValido'] = false;
allFields['apellidoValido'] = false;
allFields['fnacimientoValido'] = false;
allFields['lnacimientoValido'] = false;
allFields['paisValido'] = false;
allFields['coloniaValido'] = false;
allFields['cpValido'] = false;
allFields['clabeValido'] = false;
allFields['bancoValido'] = false;
allFields['curpValido'] = false;
allFields['telemerValido'] = false;
allFields['estadoValido'] = false;
allFields['municipioValido'] = false;

var current = 0;
show(current);

document.querySelectorAll('input').forEach(item => {
    item.addEventListener('blur', event => {
        for (var key in allFields) {
            if (!allFields[key]) {
                document.getElementById("submit").disabled = true;
                break;
            } else {
                document.getElementById("submit").disabled = false;
            }
        }
    })
});

function show(n) {
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    if (n == 0) {
        document.getElementById("back").style.display = "none";
    } else {
        document.getElementById("back").style.display = "inline";
    }
    if (n == (x.length - 1)) {
        document.getElementById("next").style.display = "none";
    } else {
        document.getElementById("next").style.display = "inline";
    }
}

function next(n) {
    var x = document.getElementsByClassName("tab");
    x[current].style.display = "none";
    current = current + n;
    if (current >= x.length) {
        document.getElementById("form").submit();
        return false;
    }
    show(current);
}

async function autoFill(field) {
    let cp = field.value
    let token = 'cf67db0d-be5d-4523-9c29-81756cc5c5aa'
    try {
        const res = await fetch(
            `https://api-sepomex.hckdrk.mx/query/info_cp/${cp}?=simplified&token=${token}`
        )
        const data = await res.json()
        if (data.error !== false) {
            let response = {}
            console.log(data)
            document.getElementById("warnmessage").style.display = "block";
            document.getElementById("warnmessage").innerHTML = "WARNING: " + data.error_message
            if(data[0]!= undefined){
                response = data[0]
            }else{
                document.getElementById("cp").className = "invalid"
            }
            document.getElementById("estado").value = response.estado;
            document.getElementById("municipio").value = response.municipio;
            document.getElementById("pais").value = 'México';
            validateContent(document.getElementById("estado"))
            validateContent(document.getElementById("municipio"))
            validateContent(document.getElementById("pais"))
            validateContent(field)
            document.getElementById("warnmessage").style.display = "none";
            getColonia()
        }
       
    } catch (error) {
        console.log(error)
    }
}

function resetSelector() {
    var selector = document.getElementById("colonia");
    var length = selector.options.length;
    for (i = length - 1; i >= 0; i--) {
        selector.options[i] = null;
    }
    var el = document.createElement("option");
    el.textContent = "Colonia (Sin Selección)";
    el.value = "none";
    selector.appendChild(el);
}

async function getColonia() {
    let token = 'cf67db0d-be5d-4523-9c29-81756cc5c5aa' // get token from website
    let cp = document.getElementById("cp").value;
    try {
        resetSelector();

        const colonias = await fetch(
            `https://api-sepomex.hckdrk.mx/query/get_colonia_por_cp/${cp}?token=${token}`
        )
        const datos = await colonias.json()
        if (datos.error === false) {
            const res =  datos.response;

            var select = document.getElementById("colonia");
            for (var i = 0; i < res.colonia.length; i++) {
                var opt = res.colonia[i];
                var el = document.createElement("option");
                el.textContent = opt;
                el.value = opt;
                select.appendChild(el);
            }
        }
    } catch (error) {
        console.log(error)
    }
}

function submitShow() {
    document.getElementById('display_nombre').innerHTML = document.getElementById("nombre").value;
    document.getElementById('display_apellidos').innerHTML = document.getElementById("apellidos").value;
    document.getElementById('display_fecha').innerHTML = document.getElementById("fnacimiento").value;
    document.getElementById('display_lnacimiento').innerHTML = document.getElementById("lnacimiento").value;
    document.getElementById('display_pais').innerHTML = document.getElementById("pais").value;
    document.getElementById('display_estado').innerHTML = document.getElementById("estado").value;
    document.getElementById('display_municipio').innerHTML = document.getElementById("municipio").value;
    document.getElementById('display_col').innerHTML = document.getElementById("colonia").value;
    document.getElementById('display_cp').innerHTML = document.getElementById("cp").value;
    document.getElementById('display_clabe').innerHTML = document.getElementById("clabe").value;
    document.getElementById('display_banco').innerHTML = document.getElementById("banco").value;
    document.getElementById('display_curp').innerHTML = document.getElementById("curp").value;
    document.getElementById('display_telemer').innerHTML = document.getElementById("telemer").value;
    document.getElementById('details').style.display = "block";
    document.getElementById("form").style.display = "none";
    document.getElementById("next").style.display = "none";
    document.getElementById("back").style.display = "none";
    document.getElementById("submit").style.display = "none";

}


function validateCURP(curp) {
    var re = /^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/;
    var valid = curp.value.match(re);
    if (!valid) {
        document.getElementById("curp").className = "invalid";
        let nuestroField = curp.name + "Valido"
        allFields[nuestroField] = false
    } else {
        document.getElementById("curp").className = "valid";
        validateContent(curp)
    }
}

function validateEmer(phone) {
    var re = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
    var valid = phone.value.match(re);
    if (!valid) {
        document.getElementById("telemer").className = "invalid";
        let nuestroField = phone.name + "Valido"
        allFields[nuestroField] = false
    } else {
        document.getElementById("telemer").className = "valid";
        validateContent(phone)
    }
}

function validateContent(field) {
    if (field.value.length > 0 && field.value != "none") {
        let nuestroField = field.name + "Valido"
        allFields[nuestroField] = true
    }
}

function validateFNac(dateInput) {
    var date_format = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;
    var valid = dateInput.value.match(date_format);
    if (!valid) {
        document.getElementById("fnacimiento").className = "invalid";
        let nuestroField = dateInput.name + "Valido"
        allFields[nuestroField] = false
    } else {
        document.getElementById("fnacimiento").className = "valid";
        validateContent(dateInput)
    }
}

const BANKS = {
    '138': '40138',
    '102': '40102',
    '614': '90614',
    '133': '40133',
    '062': '40062',
    '638': '90638',
    '103': '40103',
    '652': '90652',
    '659': '90659',
    '128': '40128',
    '674': '90674',
    '127': '40127',
    '030': '40030',
    '002': '40002',
    '131': '40131',
    '154': '40154',
    '006': '37006',
    '137': '40137',
    '160': '40160',
    '152': '40152',
    '019': '37019',
    '147': '40147',
    '106': '40106',
    '009': '37009',
    '072': '40072',
    '058': '40058',
    '166': '37166',
    '060': '40060',
    '001': '2001',
    '129': '40129',
    '145': '40145',
    '012': '40012',
    '112': '40112',
    '677': '90677',
    '683': '90683',
    '630': '90630',
    '143': '40143',
    '631': '90631',
    '901': '90901',
    '130': '40130',
    '140': '40140',
    '126': '40126',
    '680': '90680',
    '124': '40124',
    '151': '40151',
    '606': '90606',
    '648': '90648',
    '616': '90616',
    '634': '90634',
    '679': '90679',
    '689': '90689',
    '685': '90685',
    '601': '90601',
    '636': '90636',
    '168': '37168',
    '021': '40021',
    '155': '40155',
    '036': '40036',
    '902': '90902',
    '150': '40150',
    '136': '40136',
    '686': '90686',
    '059': '40059',
    '110': '40110',
    '653': '90653',
    '670': '90670',
    '602': '90602',
    '042': '40042',
    '158': '40158',
    '600': '90600',
    '108': '40108',
    '132': '40132',
    '613': '90613',
    '135': '37135',
    '637': '90637',
    '649': '90649',
    '148': '40148',
    '620': '90620',
    '642': '90642',
    '156': '40156',
    '014': '40014',
    '044': '40044',
    '623': '90623',
    '655': '90655',
    '646': '90646',
    '684': '90684',
    '656': '90656',
    '617': '90617',
    '605': '90605',
    '608': '90608',
    '113': '40113',
    '141': '40141'
};
const BANK_NAMES = {
    '40138': 'ABC Capital',
    '40102': 'Accendo Banco',
    '90614': 'Accival',
    '40133': 'Actinver',
    '40062': 'Afirme',
    '90638': 'Akala',
    '40103': 'American Express',
    '90652': 'Asea',
    '90659': 'Asp Integra Opc',
    '40128': 'Autofin',
    '90674': 'Axa',
    '40127': 'Azteca',
    '40030': 'Bajio',
    '40002': 'Banamex',
    '40131': 'Banco Famsa',
    '40154': 'Banco Finterra',
    '37006': 'Bancomext',
    '40137': 'Bancoppel',
    '40160': 'Banco S3',
    '40152': 'Bancrea',
    '37019': 'Banjercito',
    '40147': 'Bankaool',
    '40106': 'Bank Of America',
    '37009': 'Banobras',
    '40072': 'Banorte/Ixe',
    '40058': 'Banregio',
    '37166': 'Bansefi',
    '40060': 'Bansi',
    '2001': 'Banxico',
    '40129': 'Barclays',
    '40145': 'Bbase',
    '40012': 'BBVA Bancomer',
    '40112': 'Bmonex',
    '90677': 'Caja Pop Mexica',
    '90683': 'Caja Telefonist',
    '90630': 'CB Intercam',
    '40143': 'CIbanco',
    '90631': 'CI Bolsa',
    '90901': 'Cls',
    '40130': 'Compartamos',
    '40140': 'Consubanco',
    '40126': 'Credit Suisse',
    '90680': 'Cristobal Colon',
    '40124': 'Deutsche',
    '40151': 'Donde',
    '90606': 'Estructuradores',
    '90648': 'Evercore',
    '90616': 'Finamex',
    '90634': 'Fincomun',
    '90679': 'Fnd',
    '90689': 'Fomped',
    '90685': 'Fondo (Fira)',
    '90601': 'Gbm',
    '90636': 'Hdi Seguros',
    '37168': 'Hipotecaria Fed',
    '40021': 'HSBC',
    '40155': 'Icbc',
    '40036': 'Inbursa',
    '90902': 'Indeval',
    '40150': 'Inmobiliario',
    '40136': 'Intercam Banco',
    '90686': 'Invercap',
    '40059': 'Invex',
    '40110': 'JP Morgan',
    '90653': 'Kuspit',
    '90670': 'Libertad',
    '90602': 'Masari',
    '40042': 'Mifel',
    '40158': 'Mizuho Bank',
    '90600': 'Monexcb',
    '40108': 'Mufg',
    '40132': 'Multiva Banco',
    '90613': 'Multiva Cbolsa',
    '37135': 'Nafin',
    '90637': 'Order',
    '90649': 'Oskndia',
    '40148': 'Pagatodo',
    '90620': 'Profuturo',
    '90642': 'Reforma',
    '40156': 'Sabadell',
    '40014': 'Santander',
    '40044': 'Scotiabank',
    '90623': 'Skandia',
    '90655': 'Sofiexpress',
    '90646': 'STP',
    '90684': 'Transfer',
    '90656': 'Unagra',
    '90617': 'Valmex',
    '90605': 'Value',
    '90608': 'Vector',
    '40113': 'Ve Por Mas',
    '40141': 'Volkswagen'
};


function getBankName(clabe) {
    const code = clabe.value.substring(0, 3);
    var bankName = BANK_NAMES[BANKS[code]];
    if (bankName === undefined) {
        bankName = "Banco desconocido";
    }
    let bank = document.getElementById("banco");
    bank.value = bankName;
    validateContent(bank)
    validateContent(clabe)
}
