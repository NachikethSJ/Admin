export const gridLayoutColumsData =

    [
        { headerName: '', checkboxSelection: true, field: '', maxWidth: 30, filter: false },
        { headerName: "Worker Name", field: "workerName", sortable: true, maxWidth: 120 },
        { headerName: "Phone", field: "phone", sortable: true, maxWidth: 140 },
        { headerName: "Age", field: "age", sortable: true, maxWidth: 120 },
        { headerName: "Zone Id", field: "zoneId", sortable: true, maxWidth: 300 },
        { headerName: "Address", field: "address", sortable: true, maxWidth: 250 },
        { headerName: "Division Id", field: "divisionId", sortable: true, maxWidth: 200 },
        { headerName: "Village", field: "village", sortable: true, maxWidth: 100 },
        { headerName: "Skills", field: "skills", sortable: true, maxWidth: 130 },
        {
            headerName: "Worker Status", 
            field: "status",
            cellRenderer: 'statusCellRenderer',
            cellEditor: 'agRichSelectCellEditor',
            cellEditorParams: {
                values: ['NOT AVAILABLE', 'NOT CONFIRMED'],
                cellRenderer: 'statusCellRenderer'
            },
            sortable: true, maxWidth: 130
        }
    ];

export const gridLayoutRowData =
    [{
        servDate: "30/04/2020", hours: "6 - 7 AM", phone: 9945650498, specialRequest: 'good chef',
        address: 'test address', landMark: '560016', state: 'KR Puram', pin: '560016'
    }, {
        servDate: "30/04/2020", hours: "6 - 7 AM", phone: 9945650498, specialRequest: 'good chef',
        address: 'test address', landMark: '560016', state: 'KR Puram', pin: '560016'
    }, {
        servDate: "30/04/2020", hours: "6 - 7 AM", phone: 9945650498, specialRequest: 'good chef',
        address: 'test address', landMark: '560016', state: 'KR Puram', pin: '560016'

    }];