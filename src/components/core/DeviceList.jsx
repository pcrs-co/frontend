"use client"

import { useState } from "react"
import { Search, Package, Star, Plus, Minus } from "lucide-react"

const cpuData = [
  {
    id: 1,
    name: "AMD Ryzen 7 9800X3D",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 8,
    performanceCore: "4.7 GHz",
    performanceBoost: "5.2 GHz",
    microarchitecture: "Zen 5",
    tdp: "120 W",
    integratedGraphics: "Radeon",
    rating: 4.8,
    reviews: 184,
    price: 472.02,
  },
  {
    id: 2,
    name: "AMD Ryzen 7 7800X3D",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 8,
    performanceCore: "4.2 GHz",
    performanceBoost: "5 GHz",
    microarchitecture: "Zen 4",
    tdp: "120 W",
    integratedGraphics: "Radeon",
    rating: 4.7,
    reviews: 514,
    price: 358.59,
  },
  {
    id: 3,
    name: "AMD Ryzen 5 7600X",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 6,
    performanceCore: "4.7 GHz",
    performanceBoost: "5.3 GHz",
    microarchitecture: "Zen 4",
    tdp: "105 W",
    integratedGraphics: "Radeon",
    rating: 4.6,
    reviews: 278,
    price: 170.0,
  },
  {
    id: 4,
    name: "AMD Ryzen 5 9600X",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 6,
    performanceCore: "3.9 GHz",
    performanceBoost: "5.4 GHz",
    microarchitecture: "Zen 5",
    tdp: "65 W",
    integratedGraphics: "Radeon",
    rating: 4.4,
    reviews: 30,
    price: 178.0,
  },
  {
    id: 5,
    name: "AMD Ryzen 9 9950X3D",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 16,
    performanceCore: "4.3 GHz",
    performanceBoost: "5.7 GHz",
    microarchitecture: "Zen 5",
    tdp: "170 W",
    integratedGraphics: "Radeon",
    rating: 4.9,
    reviews: 22,
    price: 699.0,
  },
  {
    id: 6,
    name: "AMD Ryzen 7 9700X",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 8,
    performanceCore: "3.8 GHz",
    performanceBoost: "5.5 GHz",
    microarchitecture: "Zen 5",
    tdp: "65 W",
    integratedGraphics: "Radeon",
    rating: 4.5,
    reviews: 55,
    price: 303.42,
  },
  {
    id: 7,
    name: "AMD Ryzen 5 5600X",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 6,
    performanceCore: "3.7 GHz",
    performanceBoost: "4.6 GHz",
    microarchitecture: "Zen 3",
    tdp: "65 W",
    integratedGraphics: "None",
    rating: 4.7,
    reviews: 691,
    price: 143.0,
  },
  {
    id: 8,
    name: "AMD Ryzen 7 7700X",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 8,
    performanceCore: "4.5 GHz",
    performanceBoost: "5.4 GHz",
    microarchitecture: "Zen 4",
    tdp: "105 W",
    integratedGraphics: "Radeon",
    rating: 4.6,
    reviews: 190,
    price: 239.99,
  },
  {
    id: 9,
    name: "AMD Ryzen 5 5500",
    image: "/placeholder.svg?height=40&width=40",
    coreCount: 6,
    performanceCore: "3.6 GHz",
    performanceBoost: "4.2 GHz",
    microarchitecture: "Zen 3",
    tdp: "65 W",
    integratedGraphics: "None",
    rating: 4.3,
    reviews: 71,
    price: 69.98,
  },
]

export default function DeviceList() {
  const [selectedItems, setSelectedItems] = useState([])
  const [priceRange, setPriceRange] = useState([0, 2690])
  const [compatibilityFilter, setCompatibilityFilter] = useState(true)
  const [includeRebates, setIncludeRebates] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSelectAll = () => {
    setSelectedItems(cpuData.map((item) => item.id))
  }

  const handleSelectNone = () => {
    setSelectedItems([])
  }

  const handleItemSelect = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handlePriceRangeChange = (e, index) => {
    const newRange = [...priceRange]
    newRange[index] = Number.parseInt(e.target.value)
    setPriceRange(newRange)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-600 text-gray-600"
        }`}
      />
    ))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-72 bg-gray-800 p-4 space-y-6">
          {/* Part List Header */}
          <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-3">
            <Package className="w-5 h-5" />
            <span className="font-semibold">Part List</span>
          </div>

          {/* Compatibility Filter */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={compatibilityFilter}
                onChange={(e) => setCompatibilityFilter(e.target.checked)}
              />
              <span className="label-text text-white text-sm">Compatibility Filter</span>
            </label>
          </div>

          {/* Parts Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-400 text-sm">
              <span>PARTS</span>
              <span>TOTAL</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-400 text-xl font-bold">0</span>
              <span className="text-blue-400 text-xl font-bold">$0.00</span>
            </div>
          </div>

          {/* Estimated Wattage */}
          <div>
            <div className="text-gray-400 text-sm">ESTIMATED WATTAGE</div>
            <div className="text-blue-400 text-xl font-bold">0W</div>
          </div>

          {/* Merchants / Pricing */}
          <div className="space-y-4">
            <h3 className="font-semibold">Merchants / Pricing</h3>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">MERCHANTS</span>
                <Plus className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="text-sm mb-2 text-gray-400">PRICING OPTIONS</div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-sm"
                    checked={includeRebates}
                    onChange={(e) => setIncludeRebates(e.target.checked)}
                  />
                  <span className="label-text text-white text-sm">Include mail-in rebates</span>
                </label>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
            <h3 className="font-semibold">Filters</h3>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">PRICE</span>
                <Minus className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="range"
                    min="0"
                    max="2690"
                    value={priceRange[0]}
                    onChange={(e) => handlePriceRangeChange(e, 0)}
                    className="range range-primary range-sm"
                  />
                  <input
                    type="range"
                    min="0"
                    max="2690"
                    value={priceRange[1]}
                    onChange={(e) => handlePriceRangeChange(e, 1)}
                    className="range range-primary range-sm"
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">MANUFACTURER</span>
                <Minus className="w-4 h-4" />
              </div>
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-2">
                  <input type="checkbox" className="checkbox checkbox-sm" defaultChecked />
                  <span className="label-text text-white text-sm">All</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">1413 Compatible Products</h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="CPUs"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered bg-gray-800 border-gray-700 text-white w-64 pl-10"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleSelectAll} className="btn btn-link text-blue-400 p-0 h-auto min-h-0">
              Select All
            </button>
            <button onClick={handleSelectNone} className="btn btn-link text-gray-400 p-0 h-auto min-h-0">
              Select None
            </button>
            <button className="btn btn-link text-gray-400 p-0 h-auto min-h-0">Compare Selected</button>
            <div className="ml-auto flex items-center gap-4">
              <button className="btn btn-link text-blue-400 p-0 h-auto min-h-0">Log in to set price alerts.</button>
              <button className="btn btn-primary">Add From Filter</button>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr className="border-gray-700">
                    <th className="w-12"></th>
                    <th className="text-gray-300">Name</th>
                    <th className="text-gray-300">Core Count</th>
                    <th className="text-gray-300">Performance Core Clock</th>
                    <th className="text-gray-300">Performance Boost Clock</th>
                    <th className="text-gray-300">Microarchitecture</th>
                    <th className="text-gray-300">TDP</th>
                    <th className="text-gray-300">Integrated Graphics</th>
                    <th className="text-gray-300">Rating</th>
                    <th className="text-gray-300">Price</th>
                    <th className="w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {cpuData.map((cpu) => (
                    <tr key={cpu.id} className="border-gray-700 hover:bg-gray-750">
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm"
                          checked={selectedItems.includes(cpu.id)}
                          onChange={() => handleItemSelect(cpu.id)}
                        />
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="mask mask-squircle w-10 h-10">
                              <img src={cpu.image || "/placeholder.svg"} alt={cpu.name} />
                            </div>
                          </div>
                          <span className="font-medium">{cpu.name}</span>
                        </div>
                      </td>
                      <td>{cpu.coreCount}</td>
                      <td>{cpu.performanceCore}</td>
                      <td>{cpu.performanceBoost}</td>
                      <td>{cpu.microarchitecture}</td>
                      <td>{cpu.tdp}</td>
                      <td>{cpu.integratedGraphics}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex">{renderStars(cpu.rating)}</div>
                          <span className="text-sm text-gray-400">({cpu.reviews})</span>
                        </div>
                      </td>
                      <td className="font-bold">${cpu.price}</td>
                      <td>
                        <button className="btn btn-primary btn-sm">Add</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
