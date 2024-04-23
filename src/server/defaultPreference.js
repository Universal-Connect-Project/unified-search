module.exports = {
  "defaultProvider": "sophtron",

  "weights_conf": {
    "success_rate": {
      "use_field": "avg",
      "ration": 0.5,
      "buckets": [
        {
          "from": 0,
          "to": 30,
          "weight": 10
        },
        {
          "from": 30,
          "to": 60,
          "weight": 20
        },
        {
          "from": 60,
          "to": 90,
          "weight": 35
        },
        {
          "from": 90,
          "to": 101,
          "weight": 50
        }
      ]
    },
    "time_cost": {
      "use_field": "avg",
      "ration": 0.5,
      "buckets":[
        {
          "from": 0,
          "to": 30,
          "weight": 50
        },
        {
          "from": 30,
          "to": 50,
          "weight": 40
        },
        {
          "from": 50,
          "to": 60,
          "weight": 30
        },
        {
          "from": 60,
          "to": 70,
          "weight": 20
        },
        {
          "from": 70,
          "to": 90,
          "weight": 10
        }
      ]
    }
  },

  "hiddenBanks" : [],

  "defaultBanks" : [
    {
      "id": "citibank",
      "name": "Citibank",
      "url": "https://www.citi.com/",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-80feb7d4-f8ce-fa5e-cc71-bb22d7492fda_100x100.png"
    },
    {
      "id": "chase",
      "name": "Chase Bank",
      "url": "https://www.chase.com/",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-78c7b591-6512-9c17-b092-1cddbd3c85ba_100x100.png"
    },
    {
      "id": "wells_fargo",
      "name": "Wells Fargo",
      "url": "https://www.wellsfargo.com",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-6073ad01-da9e-f6ba-dfdf-5f1500d8e867_100x100.png"
    },
    {
      "id": "bank_of_america",
      "name": "Bank of America",
      "url": "https://www.bankofamerica.com",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-93b80c01-e275-2587-a0df-6c0995e283ef_100x100.png"
    },
    {
      "id": "227d9de3-7c18-4781-97a0-ce2ecefb1b7a",
      "name": "Barclays",
      "url": "https://www.securebanking.barclaysus.com/login.do",
      "logo_url": "https://sophtron.com/images/banklogos/barclays.png"
    },
    {
      "id": "7da0e182-a2f3-41f1-84e2-4b6f5b8112e5",
      "name": "BB&T",
      "url": "https://www.bbt.com/online-access/online-banking/default.page",
      "logo_url": "https://sophtron.com/images/banklogos/bbt.png"
    },
    {
      "id": "capital_one",
      "name": "Capital One",
      "url": "https://www.capitalone.com",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-acc3b72a-1165-9642-b41d-1e15f62d75fa_100x100.png"
    },
    {
      "id": "3d7671e4-36be-4266-971e-b50d33001382",
      "name": "Charles Schwab",
      "url": "https://client.schwab.com/Login/SignOn/CustomerCenterLogin.aspx",
      "logo_url": "https://sophtron.com/images/banklogos/charles%20schwab.png"
    },
    {
      "id": "usaa-2",
      "name": "USAA",
      "url": "https://www.usaa.com/inet/ent_logon/Logon",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-d4dde375-895e-44b3-5380-fabdc4e10949_100x100.png"
    },
    {
      "id": "68550",
      "name": "Fifth Third Bank",
      "url": "http://www.53.com/",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-3d76fbd8-bc2c-ef27-0f8a-d4d2493ddfe8_100x100.png"
    },
    {
      "id": "0b82d0db-b63d-4827-8f5c-3b115af01aa3",
      "name": "Goldman Sachs",
      "url": "https://www.goldman.com/auth/login",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/default_100x100.png"
    },
    {
      "id": "c155dab2-9133-4df3-a28e-b862af43bb38",
      "name": "HSBC Bank",
      "url": "https://www.services.online-banking.us.hsbc.com/",
      "logo_url": "https://sophtron.com/images/banklogos/hsbc%20bank.png"
    },
    {
      "id": "69397",
      "name": "Morgan Stanley",
      "url": "https://www.morganstanleyclientserv.com",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-d80822f4-375e-90fc-fb69-038cf75a7c91_100x100.png"
    },
    {
      "id": "pnc_bank",
      "name": "PNC Bank",
      "url": "http://www.pnc.com/",
      "logo_url": "https://content.moneydesktop.com/storage/MD_Assets/Ipad%20Logos/100x100/INS-0be9a5aa-d127-c11e-145f-dc5618d97d6c_100x100.png"
    },
    {
      "id": "86e1f8a0-5963-4125-9999-ccbe44d5940e",
      "name": "State Street",
      "url": "https://www.statestreetbank.com/online-banking",
      "logo_url": "https://sophtron.com/images/banklogos/state%20street.png"
    },
    {
      "id": "8275fc09-149b-4849-8a31-51ef9ba8eb6d",
      "name": "SunTrust",
      "url": "https://onlinebanking.suntrust.com/",
      "logo_url": "https://logos-list.s3-us-west-2.amazonaws.com/suntrust_logo.png"
    },
    {
      "id": "b8cb06e4-4f42-42b7-ba5a-623a5d1afe0f",
      "name": "TD Bank",
      "url": "https://onlinebanking.tdbank.com",
      "logo_url": "https://logos-list.s3-us-west-2.amazonaws.com/td_bank_logo.png"
    },
    {
      "id": "9aee59a1-59c9-4e5e-88f6-a00aa19f1612",
      "name": "US Bank",
      "url": "https://www.usbank.com/index.html",
      "logo_url": "https://logos-list.s3-us-west-2.amazonaws.com/us_bank_logo.png"
    }
  ]
}