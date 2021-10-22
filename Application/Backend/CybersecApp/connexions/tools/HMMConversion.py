def round_values(matrix, digit):
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            matrix[i][j] = round(float(matrix[i][j]), digit)
    return matrix


def parse_values(matrix):
    for i in range(len(matrix)):
        for j in range(len(matrix[i])):
            matrix[i][j] = int(matrix[i][j])
    return matrix


class HMMConversion:
    def __init__(self, hmm):
        self.states = hmm.states.split('f')
        self.transition_matrix = round_values([row.split('__') for row in hmm.transition_matrix.split('|')], 2)
        self.emission_matrix = parse_values([row.split('__') for row in hmm.emission_matrix.split('|')])

    # these functions return the global matrix and the distinct states

    def get_states(self):
        return self.states

    def get_transition_matrix(self):
        return self.transition_matrix

    def get_emission_matrix(self):
        return self.emission_matrix

    # these functions return the simplified matrix witch contains only the connexion flags
    def get_global_transition_matrix(self):
        global_matrix = [[0]*64 for _ in range(64)]
        for i in range(len(self.states)):
            for j in range(len(self.states)):
                global_matrix[int(self.states[i])][int(self.states[j])] = self.transition_matrix[i][j]
        return global_matrix

    def get_global_emission_matrix(self):
        m = [[0] * 2 for _ in range(64)]
        for i in range(len(self.states)):
            m[int(self.states[i])] = self.emission_matrix[i]

        return m
