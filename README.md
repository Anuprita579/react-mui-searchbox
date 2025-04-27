![npm version](https://img.shields.io/npm/v/react-mui-searchbox)
![license](https://img.shields.io/npm/l/react-mui-searchbox)
![downloads](https://img.shields.io/npm/dw/react-mui-searchbox)

# MUI Search Component

A powerful, feature-rich search component for React applications built with Material UI. Perfect for implementing search functionality, autocomplete, filtering, and advanced selection capabilities in your React applications.

## Features

- Customizable styling - Complete control over colors, sizes, and appearance
- Performance optimized - Built-in debounce and throttling capabilities
- Fuzzy search - Powered by Fuse.js for intelligent search results
- Autocomplete - Show suggestions as you type
- Multiple selection mode - Support for multiple selections with chip display
- Success state handling - Custom rendering after successful selection
- Advanced filtering - Case-sensitive options, nested property access
- Accessibility focused - Built on MUI components with accessibility in mind
- Loading states - Built-in loading indicators
- Static filtering method - Use filtering logic outside the component

## 📦 Installation

```bash
npm install react-mui-searchbox
# or
yarn add react-mui-searchbox
```

## 🔨 Quick Start

```jsx
import React from 'react';
import { SearchBox } from 'react-mui-searchbox';
import PersonIcon from '@mui/icons-material/Person';

function App() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
    { id: 3, name: 'Robert Johnson', email: 'robert@example.com' },
    // More data...
  ];

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Search Users</h2>
      <SearchBox
        placeholder="Search users..."
        data={data}
        filterKeys={['name', 'email']}
        leftIcon={<PersonIcon />}
        onSelect={(item) => console.log('Selected:', item)}
        onChange={(value) => console.log('Search value:', value)}
        debounce={true}
        throttleTime={300}
        autoComplete={true}
        successComponent={(item) => (
          <div>Successfully selected: {item.name}</div>
        )}
      />
    </div>
  );
}

export default App;
```

## 📚 Props API

### Input Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | string | 'Search...' | Placeholder text for the input |
| `value` | string | '' | Initial value of the input |
| `autoFocus` | boolean | false | Focus the input on mount |
| `className` | string | '' | Additional CSS class |
| `type` | string | 'text' | Input type |

### Data Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | array | [] | Array of objects to search through |
| `filterKeys` | array | [] | Object keys to search within |

### Style Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputFontColor` | string | 'inherit' | Color of input text |
| `inputBorderColor` | string | 'primary.main' | Border color of input |
| `inputFontSize` | number | 16 | Font size of input text |
| `inputHeight` | number | 56 | Height of input field |
| `inputBackgroundColor` | string | 'background.paper' | Background color of input |
| `dropDownHoverColor` | string | 'action.hover' | Hover color for dropdown items |
| `dropDownBorderColor` | string | 'divider' | Border color for dropdown |
| `chipColor` | string | 'primary' | Color for selection chips in multiple selection mode |

### Icon Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `showSearchIcon` | boolean | true | Show the search icon |
| `leftIcon` | element | null | Custom icon to show on the left |
| `iconBoxSize` | number | 24 | Size of the icon |

### Function Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onChange` | function | () => {} | Called when input value changes |
| `onSelect` | function | () => {} | Called when an item is selected |
| `onFocus` | function | () => {} | Called when input is focused |
| `onSuccess` | function | () => {} | Called on successful selection |

### Feature Flags

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `debounce` | boolean | true | Enable/disable debounce |
| `throttleTime` | number | 200 | Debounce time in milliseconds |
| `caseSensitive` | boolean | false | Enable case-sensitive search |
| `fuzzy` | boolean | false | Enable fuzzy search |
| `sortResults` | boolean | false | Sort results by relevance (fuzzy search only) |
| `clearOnSelect` | boolean | false | Clear input after selection |
| `autoComplete` | boolean | true | Show dropdown on focus |
| `multipleChip` | boolean | false | Enable multiple selection with chips |
   
### Other Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `successComponent` | function | null | Component to render after selection |
| `fuseConfigs` | object | {} | Additional Fuse.js configurations |

## 📋 Advanced Usage

### Multiple Selection with Chips

```jsx
<SearchBox
  placeholder="Select multiple users..."
  data={users}
  filterKeys={['name', 'email']}
  multipleChip={true}
  chipColor="success"
  onSelect={(selectedItems) => console.log('Selected items:', selectedItems)}
/>
```

### Custom Styling
```jsx
<SearchBox
  placeholder="Search products..."
  data={products}
  filterKeys={['name', 'description', 'category.name']}
  inputBorderColor="secondary.main"
  inputFontSize={14}
  inputHeight={48}
  inputBackgroundColor="#f5f5f5"
  dropDownHoverColor="#e0e0e0"
/>
```

### Fuzzy Search with Custom Configuration

```jsx
<SearchBox
  placeholder="Search documents..."
  data={documents}
  filterKeys={['title', 'content', 'tags']}
  fuzzy={true}
  sortResults={true}
  fuseConfigs={{
    threshold: 0.3,
    distance: 100,
    useExtendedSearch: true
  }}
/>
```

### Success State Handling

```jsx
<SearchBox
  placeholder="Select a country..."
  data={countries}
  filterKeys={['name']}
  successComponent={(country) => (
    <div className="selected-country">
      <h3>{country.name}</h3>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population.toLocaleString()}</p>
    </div>
  )}
/>
```

## Static Methods

### SearchBox.filter(searchTerm, keys, options)

Returns a function that can be used to filter an array outside the component.

```jsx
const filterFunc = SearchBox.filter('john', ['name', 'email'], { 
  fuzzy: true, 
  caseSensitive: false 
});

const filteredData = filterFunc(data);
```

## License

MIT

## 🤝 Contributing
Contributions, issues and feature requests are welcome! Feel free to check issues page.