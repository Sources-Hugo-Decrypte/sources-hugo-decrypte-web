
import DataGrid from 'react-data-grid';

function AllSources() {
  
  const columns = [
    { key: 'id', name: 'ID' },
    { key: 'title', name: 'Title' }
  ];
        
  const rows = [
    { id: 0, title: 'Example' },
    { id: 1, title: 'Demo' }
  ];

  return <DataGrid
            columns={columns}
            rows={rows}
        />;
}

export default AllSources;

/*
import ReactDataGrid from "react-data-grid";
import "./styles.css";

function AllSources(){

    const columns = [
    { key: "id", name: "ID", editable: true },
    { key: "title", name: "Title", editable: true },
    { key: "complete", name: "Complete", editable: true }
    ];

    const rows = [
    { id: 0, title: "Task 1", complete: 20 },
    { id: 1, title: "Task 2", complete: 40 },
    { id: 2, title: "Task 3", complete: 60 }
    ];

    var state = { rows };

    /*function onGridRowsUpdated = ({ fromRow, toRow, updated }) => {
        setState(state => {
            const rows = state.rows.slice();
            for (let i = fromRow; i <= toRow; i++) {
                rows[i] = { ...rows[i], ...updated };
            }
        return { rows };
        });
    };
    return (
        <ReactDataGrid
            columns={columns}
            rowsCount={3}
            rowGetter={i => state.rows[i]}
            //onGridRowsUpdated={this.onGridRowsUpdated}
            enableCellSelect={true}
        />
    );
}

export default AllSources;
*/
