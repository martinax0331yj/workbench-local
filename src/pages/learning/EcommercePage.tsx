import { ShoppingBag, TrendingUp, Truck, DollarSign, Package } from 'lucide-react';
import { useStore } from '../../store';
import { formatRelative } from '../../utils';

const productStatusLabels: Record<string, string> = {
  'idea': '初步想法', 'researching': '调研中', 'to-continue': '可继续', 'finding-supplier': '找供应商',
  'calculating': '待测算', 'testing': '测试中', 'paused': '暂停', 'abandoned': '放弃',
};
const statusColors: Record<string, string> = {
  'idea': 'bg-gray-100 text-text-muted', 'researching': 'bg-blue-50 text-mist-blue',
  'to-continue': 'bg-mist-light/30 text-mist-purple', 'finding-supplier': 'bg-warm-light text-warm-brown',
  'calculating': 'bg-orange-50 text-orange-600', 'testing': 'bg-green-50 text-mint-green',
  'paused': 'bg-gray-100 text-text-muted', 'abandoned': 'bg-gray-100 text-text-muted',
};

export default function EcommercePage() {
  const { ecommerceProducts } = useStore();

  return (
    <div>
      <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="page-title">电商</h1>
          <p className="text-body-sm text-text-muted mt-1">跨境电商调研与项目验证</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {[
          { label: '产品候选', value: ecommerceProducts.length, icon: Package, color: 'text-warm-brown' },
          { label: '调研中', value: ecommerceProducts.filter(p => p.status === 'researching').length, icon: TrendingUp, color: 'text-mist-blue' },
          { label: '测试中', value: ecommerceProducts.filter(p => p.status === 'testing').length, icon: ShoppingBag, color: 'text-mint-green' },
          { label: '找供应商', value: ecommerceProducts.filter(p => p.status === 'finding-supplier').length, icon: Truck, color: 'text-mist-purple' },
          { label: '待测算', value: ecommerceProducts.filter(p => p.status === 'calculating').length, icon: DollarSign, color: 'text-orange-400' },
        ].map(s => (
          <div key={s.label} className="card !p-3 sm:!p-4 text-center">
            <s.icon size={18} className={`mx-auto ${s.color} mb-1`} />
            <p className="text-lg sm:text-xl font-semibold text-text-primary">{s.value}</p>
            <p className="text-[10px] sm:text-caption text-text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Products */}
      {ecommerceProducts.length === 0 ? (
        <div className="card text-center py-10">
          <ShoppingBag size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
          <p className="text-text-secondary text-body-sm">暂无产品候选</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {ecommerceProducts.map(p => (
            <div key={p.id} className="card !p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[p.status] || 'bg-gray-100 text-text-muted'}`}>
                  {productStatusLabels[p.status] || p.status}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5 line-clamp-2">{p.name}</h3>
              {p.description && <p className="text-caption text-text-muted line-clamp-2 mb-2">{p.description}</p>}
              
              <div className="flex flex-wrap gap-1.5">
                {p.platform && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 text-mist-blue">{p.platform}</span>}
                {p.market && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cream text-text-muted">{p.market}</span>}
              </div>

              {p.suppliers.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-50">
                  <p className="text-[10px] text-text-muted">供应商: {p.suppliers.length} 个</p>
                </div>
              )}

              <p className="text-[10px] text-text-muted mt-2">{formatRelative(p.updatedAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
