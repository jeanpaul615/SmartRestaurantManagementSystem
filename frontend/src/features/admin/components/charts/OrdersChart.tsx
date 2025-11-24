// frontend/src/features/admin/components/charts/OrdersChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { hora: '9am', pedidos: 12 },
  { hora: '10am', pedidos: 19 },
  { hora: '11am', pedidos: 25 },
  { hora: '12pm', pedidos: 45 },
  { hora: '1pm', pedidos: 52 },
  { hora: '2pm', pedidos: 38 },
  { hora: '3pm', pedidos: 28 },
  { hora: '4pm', pedidos: 15 },
];

export const OrdersChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="hora" 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="#888"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px'
          }}
          formatter={(value: number) => [`${value}`, 'Pedidos']}
        />
        <Bar 
          dataKey="pedidos" 
          fill="#f97316" 
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
