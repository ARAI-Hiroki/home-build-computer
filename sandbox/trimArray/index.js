const data = [
  [
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "line",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ]
  ],
  [
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ]
  ],
  [
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ],
    [
      "",
      "",
      "line",
      "",
      ""
    ],
    [
      "",
      "",
      "",
      "",
      ""
    ]
  ]
]

function trimRow(arr) {

  const isBlankArr = (arr) => arr.every((val) => val === "")

  let lastNonBlankRow = -Infinity
  for (let z = 0; z < arr.length; z++) {
    for (let y = 0; y < arr[z].length; y++) {
      if (!isBlankArr(arr[z][y])) {
        lastNonBlankRow = Math.max(lastNonBlankRow, y)
      }
    }
  }

  let firstNonBlankRow = Infinity
  for (let z = 0; z < arr.length; z++) {
    for (let y = arr[z].length - 1; y >= 0; y--) {
      if (!isBlankArr(arr[z][y])) {
        firstNonBlankRow = Math.min(firstNonBlankRow, y)
      }
    }
  }

  for (let z = 0; z < arr.length; z++) {
    arr[z].splice(0, firstNonBlankRow)
    arr[z].splice(lastNonBlankRow, arr[z].length - lastNonBlankRow)
  }

  return arr
}

function trimColumn(arr) {
  const transpose = arr => arr.map(layer => layer[0].map((_, i) => layer.map(row => row[i])))

  const trimed = trimRow(transpose(arr))
  return transpose(trimed)
}

function trim3DArray(arr) {
  arr = trimColumn(arr)
  arr = trimRow(arr)
  return arr
}

window.onload = function () {


  const input = data.map(e => e)
  console.log(JSON.stringify(input[2]))

  const output = trim3DArray(input)
  console.log(JSON.stringify(output[2]))
}