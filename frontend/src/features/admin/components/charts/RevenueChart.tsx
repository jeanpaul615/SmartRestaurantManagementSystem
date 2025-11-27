// frontend/src/features/admin/components/charts/RevenueChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { name: 'Lun', ingresos: 4000 },
  { name: 'Mar', ingresos: 3000 },
  { name: 'Mié', ingresos: 5000 },
  { name: 'Jue', ingresos: 4500 },
  { name: 'Vie', ingresos: 6000 },
  { name: 'Sáb', ingresos: 7500 },
  { name: 'Dom', ingresos: 7000 },
];

export const RevenueChart: React.FC = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="name" stroke="#888" style={{ fontSize: '12px' }} />
        <YAxis stroke="#888" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px',
          }}
          formatter={(value: number) => [`$${value}`, 'Ingresos']}
        />
        <Line
          type="monotone"
          dataKey="ingresos"
          stroke="#f97316"
          strokeWidth={3}
          dot={{ fill: '#f97316', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
