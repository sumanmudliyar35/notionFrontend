import React, { useCallback, useEffect, useRef, useState } from 'react'
import RecursiveTaskTable from './components/RecursiveTaskTable/RecursiveTaskTable';
import type { CollapseProps } from 'antd';
import { Collapse } from 'antd';
import * as styled from "./style"
import CustomSelect from '../../components/customSelect/CustomSelect';
import DateInput from '../../components/CustomDateInput/CustomDateInput';
import dayjs from 'dayjs';
import CustomSearchInput from '../../components/CustomSearchInput/CustomSearchInput';

const intervals = [
  { days: 1, label: ' 1 Day' },
  { days: 3, label: ' 3 Days' },
  { days: 7, label: ' 7 Days' },
  { days: 15, label: ' 15 Days' },
  { days: 30, label: ' 30 Days' },
  { days: 90, label: ' 90 Days' },
  { days: 180, label: ' 180 Days' },
  { days: 365, label: ' 365 Days' },
];



const RecursiveTask = () => {

    const [filters, setFilters] = useState<Record<string, string | string[]>>({});
        const [activeFilters, setActiveFilters] = useState<string[]>([]);

            const [searchText, setSearchText] = useState<string>('');

              const searchInputRef = useRef<HTMLInputElement>(null);
            

        
            
          const availableFilterColumns = [
 
  {header: 'Date', accessorKey: 'taskDate'},
];


 const [commentsVisible, setCommentsVisible] = useState<boolean>(false);
    
            const toggleAllCommentsVisibility = useCallback(() => {
              setCommentsVisible(prev => !prev);
            }, []);



   const handleAddFilter = (columnKey: any) => {
  console.log("Adding filter for column:", columnKey);
  setActiveFilters((prev) => [...prev, columnKey.value]);
};


const handleFilterChange = (key: string, value: string) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
  }));
};


  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Only trigger on Ctrl+F (not Ctrl+Shift+F or Ctrl+Alt+F)
    if (e.ctrlKey && !e.shiftKey && !e.altKey && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);



const handleRemoveFilter = (key: string) => {



    const relatedKeys = {
   
      'createdAt': ['createdAt', 'createdAtType', 'createdAtStart', 'createdAtEnd'],
      'taskDate': ['taskDate', 'dateType', 'taskStartDate', 'taskEndDate'],
      'taskStartDate': ['taskStartDate', 'dateType', 'taskDate', 'taskEndDate'],
      'taskEndDate': ['taskEndDate', 'dateType', 'taskDate', 'taskStartDate'],
      'assignedTo': ['assignedTo'],

  };


    const keysToRemove = relatedKeys[key as keyof typeof relatedKeys] || [key];


  // Remove all related keys from filters
  setFilters((prev) => {
    const newFilters = { ...prev };
    keysToRemove.forEach(k => delete newFilters[k]);
    return newFilters;
  });

  setActiveFilters((prev: string[]) => prev.filter((k) => k !== key));
};

 const dateOption =[
  { label: 'Before', value: 'before' },
          { label: 'After', value: 'after' },
          { label: 'On Date', value: 'on' },
          { label: 'In Between', value: 'between' },
]

const items: CollapseProps['items'] = intervals.map((interval, idx) => ({
  key: String(interval.days),
  label: <span style={{ color: '#1677ff' }}>{interval.label}</span>,
 children: (
    <div style={{ color: '#fff', background: '#181818', minHeight: 100, padding: 0 }}>
      <RecursiveTaskTable     
      
      key={interval.days}
          tableIndex={idx} // pass index


 intervalDays={interval.days}  customFilters={filters}  customActiveFilters={activeFilters}  isCommentVisible={commentsVisible} customSearchText={searchText} />
    </div>
  ),}));
  
  return (
    <>
     <styled.FiltersDiv>

      <styled.FilterAndHideCommentsDiv>


       {activeFilters.map((key: any) => {
 
  if (key === 'taskDate') {
    const dateType = filters.dateType;
    return (
      <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
        <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500, minWidth: "fit-content" }}>
Date       
 </span>
        <CustomSelect
          size="small"
          style={{ width: 100, marginRight: 8 }}
          value={dateOption?.find(opt => opt.value === dateType) || null}
          onChange={val => {
            setFilters(prev => ({ ...prev, dateType: val.value }));
          }}
          options={dateOption}
        />
        {dateType === 'between' ? (
          <>
            <styled.singleDateDiv>
              <DateInput
                value={filters.taskStartDate || ''}
                onChange={date =>
                  setFilters(prev => ({
                    ...prev,
                    taskStartDate: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                  }))
                }
                placeholder="Start date"
              />
            </styled.singleDateDiv>
            <styled.singleDateDiv>
              <DateInput
                value={filters.taskEndDate || ''}
                onChange={date =>
                  setFilters(prev => ({
                    ...prev,
                    taskEndDate: date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                  }))
                }
                placeholder="End date"
              />
            </styled.singleDateDiv>
          </>
        ) : (
          <styled.singleDateDiv>
            <DateInput
              value={filters[key] || ''}
             onChange={date =>
                             handleFilterChange(
                               key,
                               date && dayjs(date).isValid() ? date.format('YYYY-MM-DD') : ''
                             )
                           }
              placeholder="Select date"
            />
          </styled.singleDateDiv>
        )}
        <span
          onClick={() => {
            handleRemoveFilter('dateType');
            handleRemoveFilter('taskDate');
            handleRemoveFilter('taskStartDate');
            handleRemoveFilter('taskEndDate');
          }}
          style={{
            cursor: 'pointer',
            padding: '0 6px',
            fontSize: 16,
            color: 'white',
          }}
        >
          ×
        </span>
      </styled.FilterTag>
    );
  };


  

  



  // Default rendering for other filters
  return (
    <styled.FilterTag key={key} active={!!filters[key]} style={{ background: 'rgb(25, 25, 25)' }}>
      <styled.FilterHeader>
        <span style={{ color: '#bbb', marginRight: 6, fontWeight: 500 }}>
          Date
        </span>
      </styled.FilterHeader>
      <styled.WhitePlaceholderInput
        size="small"
        value={filters[key]}
        onChange={(e: any) => handleFilterChange(key, e.target.value)}
          style={{
            width: 150,
            background: 'rgb(25, 25, 25)',
            color: 'white',
            border: 'transparent',
          }}
        />
    
      <span
        onClick={() => {
          
            handleRemoveFilter(key);
          
        }}
        style={{
          cursor: 'pointer',
          padding: '0 6px',
          fontSize: 16,
          color: 'white',
        }}
      >
        ×
      </span>

     

      
    </styled.FilterTag>
  );
})}




   <CustomSelect
    placeholder="+ Filter"
    size="small"
    width="150px"
    value={null}
    onChange={handleAddFilter}
    options={availableFilterColumns.map((col: any) => ({
      label: col.header,
      value: col.accessorKey,
    }))}


  />


  <styled.CommentToggleButton 
                    onClick={toggleAllCommentsVisibility}
                    type="button"
                  >
                    {commentsVisible ? 'Hide Comments' : 'Show Comments'}
                  </styled.CommentToggleButton>

  </styled.FilterAndHideCommentsDiv>

    


<styled.searchInputDiv>


                   <CustomSearchInput
                            placeholder="Search"
                            allowClear
                            value={searchText}
                            onChange={e => setSearchText(e.target.value)}
                            style={{ width: 200}}
                              ref={searchInputRef}
                  
                          />
     
     </styled.searchInputDiv>

     


      

  </styled.FiltersDiv> 
    
    
    <Collapse  items={items}    defaultActiveKey={intervals.map(interval => String(interval.days))}
/>


    </>
  )
}

export default RecursiveTask