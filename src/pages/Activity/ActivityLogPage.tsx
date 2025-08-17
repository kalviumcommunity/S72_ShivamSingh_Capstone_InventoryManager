import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Layout } from '../../components/layout/Layout';
import { useActivity } from '../../hooks/useActivity';
import { ClipboardList, Search, Filter, ArrowUpDown } from 'lucide-react';
import { ActivityLogType } from '../../types/activity';
import CustomButton from '../../components/common/CustomButton';

const ActivityLogPage = () => {
  const { logs, loading } = useActivity();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<{ key: keyof ActivityLogType; direction: 'asc' | 'desc' }>({
    key: 'timestamp',
    direction: 'desc'
  });

  // Filter and sort logs
  const filteredLogs = logs
    .filter(log => {
      const matchesSearch = 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
        
      const matchesFilter = filterType === 'all' || log.action === filterType;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];
      
      if (valueA < valueB) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  const handleSort = (key: keyof ActivityLogType) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  return (
    <Layout title="Activity Log">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input 
            type="text" 
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Search activity logs..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          
          <select
            className="input"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Activities</option>
            <option value="create">Created</option>
            <option value="update">Updated</option>
            <option value="delete">Deleted</option>
          </select>
          
          <CustomButton 
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
              setSortConfig({ key: 'timestamp', direction: 'desc' });
            }}
          >
            <Filter />
            Reset
          </CustomButton>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : filteredLogs.length > 0 ? (
        <motion.div 
          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('timestamp')}
                  >
                    <div className="flex items-center">
                      <span>Timestamp</span>
                      {sortConfig.key === 'timestamp' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 text-gray-400 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('userName')}
                  >
                    <div className="flex items-center">
                      <span>User</span>
                      {sortConfig.key === 'userName' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 text-gray-400 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('action')}
                  >
                    <div className="flex items-center">
                      <span>Action</span>
                      {sortConfig.key === 'action' && (
                        <ArrowUpDown className={`ml-1 h-3 w-3 text-gray-400 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.userName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${log.action === 'create' ? 'bg-success-100 text-success-800' :
                          log.action === 'update' ? 'bg-primary-100 text-primary-800' :
                          log.action === 'delete' ? 'bg-error-100 text-error-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-4">
            <ClipboardList className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activity logs found</h3>
          <p className="text-gray-500">
            {searchQuery || filterType !== 'all' ? 
              'No logs match your current filters. Try adjusting your search criteria.' : 
              'Activity logs will appear here as users interact with the system.'}
          </p>
        </div>
      )}
    </Layout>
  );
};

export default ActivityLogPage;