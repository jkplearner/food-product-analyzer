import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  RadialLinearScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Filler,
  RadarController,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './CompareProducts.css';
import { radarOptions, barOptions } from './ChartOptions';
import { height } from '@mui/system';
// Register ALL necessary chart components
ChartJS.register(
    CategoryScale,
    RadialLinearScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Filler,
    RadarController,
    Title,
    Tooltip,
    Legend
  );

const CompareProducts = () => {
  const location = useLocation();
  const { id } = location.state || {};

  const [products, setProducts] = useState([]);
  const [selectedProduct1, setSelectedProduct1] = useState('');
  const [selectedProduct2, setSelectedProduct2] = useState('');
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [id]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const extractNutritionalData = (analysisResult) => {
    const parseValue = (text, nutrient) => {
      const regex = new RegExp(`${nutrient}[^\\d]*(\\d+(?:\\.\\d+)?)`);
      const match = text.match(regex);
      return match ? parseFloat(match[1]) : 0;
    };

    return {
      energy: parseValue(analysisResult, 'Energy'),
      protein: parseValue(analysisResult, 'Protein'),
      carbohydrate: parseValue(analysisResult, 'Carbohydrate'),
      totalSugars: parseValue(analysisResult, 'Total Sugars'),
      totalFat: parseValue(analysisResult, 'Total Fat'),
      saturatedFat: parseValue(analysisResult, 'Saturated Fat'),
      sodium: parseValue(analysisResult, 'Sodium'),
    };
  };

  const kMeansClustering = (data) => {
    return data.map(point => {
      const [protein, carbs, fat] = point;
      const total = protein + carbs + fat;
      const proteinRatio = protein / total;
      const carbsRatio = carbs / total;

      if (proteinRatio > 0.3) return 'High-Protein';
      if (carbsRatio > 0.5) return 'High-Carb';
      return 'Balanced';
    });
  };

  const compareProducts = async () => {
    if (!selectedProduct1 || !selectedProduct2) {
      alert('Please select two products to compare');
      return;
    }

    setLoading(true);

    try {
      const product1 = products.find(p => p._id === selectedProduct1);
      const product2 = products.find(p => p._id === selectedProduct2);

      if (!product1 || !product2) return;

      const data1 = extractNutritionalData(product1.analysisResult);
      const data2 = extractNutritionalData(product2.analysisResult);

      const nutritionalProfiles = [
        [data1.protein, data1.carbohydrate, data1.totalFat],
        [data2.protein, data2.carbohydrate, data2.totalFat]
      ];

      const clusters = kMeansClustering(nutritionalProfiles);

      setComparisonData({
        radar: {
          labels: ['Protein', 'Carbs', 'Fat', 'Sugars', 'Sodium'],
          datasets: [
            {
              label: product1.productName,
              data: [data1.protein, data1.carbohydrate, data1.totalFat, data1.totalSugars, data1.sodium / 100],
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(54, 162, 235, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
            },
            {
              label: product2.productName,
              data: [data2.protein, data2.carbohydrate, data2.totalFat, data2.totalSugars, data2.sodium / 100],
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              pointBackgroundColor: 'rgba(255, 99, 132, 1)',
              pointBorderColor: '#fff',
              pointHoverBackgroundColor: '#fff',
              pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
            },
          ],
        },
        bar: {
          labels: ['Energy (kcal)', 'Protein (g)', 'Carbs (g)', 'Sugars (g)', 'Fat (g)'],
          datasets: [
            {
              label: product1.productName,
              data: [data1.energy, data1.protein, data1.carbohydrate, data1.totalSugars, data1.totalFat],
              backgroundColor: 'rgba(54, 162, 235, 0.8)',
            },
            {
              label: product2.productName,
              data: [data2.energy, data2.protein, data2.carbohydrate, data2.totalSugars, data2.totalFat],
              backgroundColor: 'rgba(255, 99, 132, 0.8)',
            },
          ],
        },
        clusters,
        products: [product1, product2],
      });
    } catch (error) {
      console.error('Error comparing products:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.8)',
          backdropColor: 'transparent',
          font: { size: 12 }
        },
      },
    },
    plugins: {
      legend: {
        labels: { 
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 14 }
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        ticks: { 
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12 }
        },
      },
      x: {
        ticks: { 
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 12 }
        },
      },
    },
    plugins: {
      legend: {
        labels: { 
          color: 'rgba(255, 255, 255, 0.8)',
          font: { size: 14 }
        },
      },
    },
  };

  return (
    <div className="compare-container">
      <div className="compare-header">
        <Scale className="compare-icon" size={32} />
        <h2>Compare Products</h2>
      </div>

      <div className="product-selection">
        <div className="select-wrapper">
          <select
            value={selectedProduct1}
            onChange={(e) => setSelectedProduct1(e.target.value)}
            className="product-select"
          >
            <option value="">Select first product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.productName}
              </option>
            ))}
          </select>

          <select
            value={selectedProduct2}
            onChange={(e) => setSelectedProduct2(e.target.value)}
            className="product-select"
          >
            <option value="">Select second product</option>
            {products.map((product) => (
              <option key={product._id} value={product._id}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>

        <button
          className="compare-button"
          onClick={compareProducts}
          disabled={loading || !selectedProduct1 || !selectedProduct2}
        >
          {loading ? 'Comparing...' : 'Compare Products'}
        </button>
      </div>

      {comparisonData && (
        <div className="comparison-results">
          <div className="chart-container">
            <h3>Nutritional Profile Comparison</h3>
            <div className="radar-chart">
              <Radar data={comparisonData.radar} options={radarOptions}  />
            </div>
          </div>

          <div className="chart-container">
            <h3>Detailed Nutritional Comparison</h3>
            <Bar data={comparisonData.bar} options={barOptions} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CompareProducts;