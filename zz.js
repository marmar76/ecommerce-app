const model = [
    {
        id: 1,
        spec: [
            1, 2,3, 4
        ],
        pass:23,
        word:23
    },
    {
        id: 1,
        spec: [
            1, 2,3, 4
        ]
    },
    {
        id: 1,
        spec: [
            1, 2,3, 4
        ]
    },
    {
        id: 1,
        spec: [
            1, 2,3, 4
        ]
    },
    {
        id: 1,
        spec: [
            1, 2,3, 4
        ]
    },
]
console.log(model.map(function (x) {  
    x.gura = 1
    x.zeta = 1
    return x
}));